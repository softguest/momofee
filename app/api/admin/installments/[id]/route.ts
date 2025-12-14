import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { installments, payments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request, { params }: any) {
  const existingPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.installmentId, params.id));

  if (existingPayments.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete installment with payments" },
      { status: 400 }
    );
  }

  await db.delete(installments).where(eq(installments.id, params.id));

  return NextResponse.json({ success: true });
}
