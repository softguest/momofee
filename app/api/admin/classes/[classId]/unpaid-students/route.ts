import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  classFees,
  payments,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ classId: string }> }
) {
    const { classId } =await context.params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  assertAdmin(admin?.role);

  const classStudents = await db.query.students.findMany({
    where: eq(students.classId, classId),
  });

  const fees = await db.query.classFees.findMany({
    where: eq(classFees.classId, classId),
  });

  const results = [];

  for (const student of classStudents) {
    const studentPayments = await db.query.payments.findMany({
      where: eq(payments.studentId, student.id),
    });

    const totalBilled = fees.reduce((s, f) => s + f.totalAmount, 0);
    const totalPaid = studentPayments
      .filter((p) => p.status === "success")
      .reduce((s, p) => s + p.amount, 0);

    if (totalPaid < totalBilled) {
      results.push({
        studentId: student.id,
        // name: `${student.firstName} ${student.lastName}`,
        name: student.studentCode,
        totalBilled,
        totalPaid,
        balance: totalBilled - totalPaid,
        status: totalPaid === 0 ? "UNPAID" : "PARTIALLY PAID",
      });
    }
  }

  return NextResponse.json(results);
}
