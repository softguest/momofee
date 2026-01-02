import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  payments,
  students,
  classFees,
  classes,
  classFeeInstallments,
  users,
} from "@/config/schema";
import { desc, eq, isNull } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // 🔑 Get role from DB
  const dbUser = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (!dbUser.length || dbUser[0].role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Authorized
  const data = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      momoTransactionId: payments.momoTransactionId,
      createdAt: payments.createdAt,

      student: {
        firstName: students.firstName,
        lastName: students.lastName,
        studentCode: students.studentCode,
      },

      class: { name: classes.name },
      fee: { name: classFees.name },
      installment: { name: classFeeInstallments.name },
    })
    .from(payments)
    .leftJoin(students, eq(payments.studentId, students.id))
    .leftJoin(classFees, eq(payments.classFeeId, classFees.id))
    .leftJoin(classes, eq(classFees.classId, classes.id))
    .leftJoin(classFeeInstallments, eq(payments.installmentId, classFeeInstallments.id))
    .where(isNull(payments.deletedAt))
    .orderBy(desc(payments.createdAt));

  return NextResponse.json(data);
}
