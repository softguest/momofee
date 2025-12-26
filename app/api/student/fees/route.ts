import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, students, classFees, payments } from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!dbUser || dbUser.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student = await db.query.students.findFirst({
    where: eq(students.userId, dbUser.id),
  });

  if (!student) {
    return NextResponse.json({ error: "Student record not found" }, { status: 404 });
  }

  const fees = await db.query.classFees.findMany({
    where: eq(classFees.classId, student.classId),
  });

  const studentPayments = await db.query.payments.findMany({
    where: eq(payments.studentId, student.id),
  });

  const result = fees.map((fee) => {
    const paid = studentPayments
      .filter(
        (p) =>
          p.classFeeId === fee.id &&
          p.status === "success"
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const balance = fee.totalAmount - paid;

    let status = "UNPAID";
    if (paid === 0) status = "UNPAID";
    else if (paid < fee.totalAmount) status = "PARTIALLY PAID";
    else status = "PAID";

    return {
      fee,
      totalPaid: paid,
      balance,
      status,
    };
  });

  return NextResponse.json({
    student,
    fees: result,
  });
}