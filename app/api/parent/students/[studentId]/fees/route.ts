import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  parentsStudents,
  classFees,
  payments,
} from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!dbUser || dbUser.role !== "parent") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify parent-child relationship
  const link = await db.query.parentsStudents.findFirst({
    where: and(
      eq(parentsStudents.parentUserId, dbUser.id),
      eq(parentsStudents.studentId, studentId)
    ),
  });

  if (!link) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const student = await db.query.students.findFirst({
    where: eq(students.id, studentId),
  });

  const fees = await db.query.classFees.findMany({
    where: eq(classFees.classId, student!.classId),
  });

  const studentPayments = await db.query.payments.findMany({
    where: eq(payments.studentId, student!.id),
  });

  const result = fees.map((fee) => {
    const paid = studentPayments
      .filter((p) => p.classFeeId === fee.id && p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      fee,
      totalPaid: paid,
      balance: fee.totalAmount - paid,
      status:
        paid === 0
          ? "UNPAID"
          : paid < fee.totalAmount
          ? "PARTIALLY PAID"
          : "PAID",
    };
  });

  return NextResponse.json({ student, fees: result });
}
