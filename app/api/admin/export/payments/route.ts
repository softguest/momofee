import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { payments, students } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      momoTransactionId: payments.momoTransactionId,
      studentFirst: students.firstName,
      studentLast: students.lastName,
    })
    .from(payments)
    .leftJoin(students, eq(payments.studentId, students.id));

  const header = [
    "Payment ID",
    "Student Name",
    "Amount",
    "Status",
    "Date",
    "MoMo Transaction ID",
  ];

  const lines = [
    header.join(","),
    ...rows.map((p) =>
      [
        p.id,
        `"${p.studentFirst} ${p.studentLast}"`,
        Number(p.amount),
        p.status,
        // p.createdAt.toISOString(),
        p.momoTransactionId ?? "",
      ].join(",")
    ),
  ];

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="payments_export.csv"`,
    },
  });
}
