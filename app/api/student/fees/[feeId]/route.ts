import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  classFees,
  classFeeInstallments,
  payments,
} from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ feeId: string }>}
) {
  const { feeId } = await context.params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get DB user
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || user.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get student record
  const student = await db.query.students.findFirst({
    where: eq(students.userId, user.id),
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // Fetch fee
  const fee = await db.query.classFees.findFirst({
    where: eq(classFees.id, feeId),
  });

  if (!fee || fee.classId !== student.classId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Installments
  const installments = await db.query.classFeeInstallments.findMany({
    where: eq(classFeeInstallments.classFeeId, fee.id),
  });

  // Payments
  const studentPayments = await db.query.payments.findMany({
    where: and(
      eq(payments.studentId, student.id),
      eq(payments.classFeeId, fee.id)
    ),
  });

  const totalPaid = studentPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const status =
    totalPaid === 0
      ? "UNPAID"
      : totalPaid < fee.totalAmount
      ? "PARTIALLY PAID"
      : "PAID";

  return NextResponse.json({
    fee,
    installments,
    payments: studentPayments,
    totalPaid,
    balance: fee.totalAmount - totalPaid,
    status,
  });
}
