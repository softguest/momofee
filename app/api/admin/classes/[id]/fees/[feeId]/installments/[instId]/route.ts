import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFeeInstallments, payments } from "@/config/schema";
import { eq } from "drizzle-orm";

interface Params {
  id: string;
  feeId: string;
  instId: string;
}

export async function PUT(req: Request, context: { params: Promise<Params> }) {
  const params = await context.params;
  const body = await req.json();

  await db
    .update(classFeeInstallments)
    .set({
      name: body.name,
      amount: Number(body.amount),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    })
    .where(eq(classFeeInstallments.id, params.instId));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, context: { params: Promise<Params> }) {
  const params = await context.params;

  const paymentsExist = await db
    .select()
    .from(payments)
    .where(eq(payments.installmentId, params.instId));

  if (paymentsExist.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete installment with payments." },
      { status: 400 }
    );
  }

  await db
    .delete(classFeeInstallments)
    .where(eq(classFeeInstallments.id, params.instId));

  return NextResponse.json({ success: true });
}
