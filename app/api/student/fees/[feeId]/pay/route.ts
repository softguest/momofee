import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students, payments, classFeeInstallments, studentFees, users } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch user from DB
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
    
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }
    
        assertAdmin(dbUser.role); // ✅ check DB role

    const body = await req.json();
    const { installmentId, studentFeeId, amount, momoTransactionId } = body;

    // Verify student
    const student = await db.query.students.findFirst({ where: eq(students.userId, userId) });
    if (!student) return NextResponse.json({ error: "Student record not found" }, { status: 404 });

    // Optional: verify installment or studentFee exists
    if (installmentId) {
      const installment = await db.query.classFeeInstallments.findFirst({ where: eq(classFeeInstallments.id, installmentId) });
      if (!installment) return NextResponse.json({ error: "Installment not found" }, { status: 404 });
    }

    if (studentFeeId) {
      const studentFee = await db.query.studentFees.findFirst({ where: eq(studentFees.id, studentFeeId) });
      if (!studentFee) return NextResponse.json({ error: "Student fee not found" }, { status: 404 });
    }

    // Create payment record
    const [newPayment] = await db.insert(payments).values({
      studentId: student.id,
      installmentId: installmentId ?? null,
      classFeeId: studentFeeId ?? null,
      amount,
      status: "pending", // initially pending
      momoTransactionId,
    }).returning();

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
