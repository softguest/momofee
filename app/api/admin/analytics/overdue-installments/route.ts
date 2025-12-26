import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  classFeeInstallments,
  payments,
  students,
  classFees,
} from "@/config/schema";
import { eq, and, lt } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  assertAdmin(admin?.role);

  const today = new Date();

  const installments = await db.query.classFeeInstallments.findMany({
    where: lt(classFeeInstallments.dueDate, today),
  });

  const overdue = [];

  for (const inst of installments) {
    const instPayments = await db.query.payments.findMany({
      where: eq(payments.installmentId, inst.id),
    });

    const paid = instPayments
      .filter((p) => p.status === "success")
      .reduce((s, p) => s + p.amount, 0);

    if (paid < inst.amount) {
      const fee = await db.query.classFees.findFirst({
        where: eq(classFees.id, inst.classFeeId),
      });

      overdue.push({
        installmentId: inst.id,
        installment: inst.name,
        dueDate: inst.dueDate,
        feeName: fee?.name,
        expected: inst.amount,
        paid,
        balance: inst.amount - paid,
      });
    }
  }

  return NextResponse.json(overdue);
}
