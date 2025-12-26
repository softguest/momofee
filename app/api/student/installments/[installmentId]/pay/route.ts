import { NextResponse } from "next/server";
import { db } from "@/config/db";
import {
  students,
  payments,
  classFeeInstallments,
  studentFees,
  users,
} from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  context: { params: Promise<{ installmentId: string }> }
) {
  try {
    const { installmentId } = await context.params;

    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Logged-in user (student)
    const student = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!student)
      return NextResponse.json(
        { error: "Student record not found" },
        { status: 404 }
      );

    // Verify installment
    const installment = await db.query.classFeeInstallments.findFirst({
      where: eq(classFeeInstallments.id, installmentId),
    });

    if (!installment)
      return NextResponse.json(
        { error: "Installment not found" },
        { status: 404 }
      );

    const body = await req.json();
    const { amount, momoTransactionId } = body;

    // Create payment
    const [payment] = await db
      .insert(payments)
      .values({
        studentId: student.id,
        classFeeId: installment.classFeeId, // ✅ REQUIRED
        installmentId,
        amount,
        status: "pending",
        momoTransactionId,
      })
      .returning();

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}
