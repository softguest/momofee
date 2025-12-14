import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { fees, installments, payments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: any) {
  const [fee] = await db.select().from(fees).where(eq(fees.id, params.feeId));
  return NextResponse.json(fee);
}

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  await db
    .update(fees)
    .set({
      academicYear: body.academicYear,
      term: body.term,
      totalAmount: body.totalAmount,
      description: body.description,
    })
    .where(eq(fees.id, params.feeId));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: any) {
  // Prevent deleting fees with payments
  const existingPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.feeId, params.feeId));

  if (existingPayments.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete fee with existing payments" },
      { status: 400 }
    );
  }

  // Delete installments first
  await db.delete(installments).where(eq(installments.feeId, params.feeId));

  // Delete fee
  await db.delete(fees).where(eq(fees.id, params.feeId));

  return NextResponse.json({ success: true });
}
