import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { payments, students } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      momoTransactionId: payments.momoTransactionId,
      studentName: students.firstName,
      studentLast: students.lastName,
    })
    .from(payments)
    .leftJoin(students, eq(payments.studentId, students.id))
    .orderBy(desc(payments.createdAt))
    .limit(10);

  return NextResponse.json({
    payments: rows.map((p) => ({
      ...p,
      studentName: `${p.studentName} ${p.studentLast}`,
    })),
  });
}
