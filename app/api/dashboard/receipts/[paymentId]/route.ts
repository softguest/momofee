// app/api/receipts/[paymentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { db } from "@/config/db";
import {
  payments,
  students,
  classFeeInstallments,
  classFees,
  users,
  parentsStudents,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { paymentId } = await params;

  // ✅ Load payment
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);

  if (!payment) {
    return new NextResponse("Payment not found", { status: 404 });
  }

  // ✅ Load student
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, payment.studentId))
    .limit(1);

  if (!student) {
    return new NextResponse("Student not found", { status: 404 });
  }

  // ✅ Load installment
  const [inst] = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.id, payment.installmentId))
    .limit(1);

  if (!inst) {
    return new NextResponse("Installment not found", { status: 404 });
  }

  // ✅ Load fee
  const [fee] = await db
    .select()
    .from(classFees)
    .where(eq(classFees.id, inst.classFeeId))
    .limit(1);

  // ✅ Load requesting user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  // ✅ Authorization
  if (user.role === "student" && user.id !== student.userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (user.role === "parent") {
    const link = await db
      .select()
      .from(parentsStudents)
      .where(eq(parentsStudents.studentId, student.id))
      .limit(1);

    if (link.length === 0) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ✅ Generate PDF
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(20).text("Payment Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text("ForgeFit School System");
  doc.text("Bamenda, Cameroon");
  doc.text("support@forgefit.com");
  doc.moveDown();

  doc.fontSize(14).text("Receipt Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Receipt ID: ${payment.id}`);
  // doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);
  doc.text(`Status: ${payment.status}`);
  if (payment.momoTransactionId) {
    doc.text(`MoMo Transaction ID: ${payment.momoTransactionId}`);
  }
  doc.moveDown();

  doc.fontSize(14).text("Student Information", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(
    `Name: ${student.firstName} ${student.lastName}`
  );
  doc.text(`Student Code: ${student.studentCode}`);
  doc.moveDown();

  doc.fontSize(14).text("Fee Information", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Fee: ${fee.name}`);
  doc.text(`Academic Year: ${fee.academicYear}`);
  doc.text(`Term: ${fee.term}`);
  doc.text(`Installment: ${inst.name}`);
  doc.text(`Amount Paid: ${Number(payment.amount).toLocaleString()} XAF`);
  doc.moveDown();

  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for your payment.", {
    align: "center",
  });

  doc.end();

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${payment.id}.pdf"`,
    },
  });
}
