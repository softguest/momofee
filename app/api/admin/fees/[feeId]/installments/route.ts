import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { installments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: any) {
  const rows = await db
    .select()
    .from(installments)
    .where(eq(installments.feeId, params.feeId));

  return NextResponse.json(rows);
}

export async function PUT(req: Request, { params }: any) {
  const { installments: rows } = await req.json();

  for (const inst of rows) {
    await db
      .update(installments)
      .set({
        name: inst.name,
        amount: inst.amount,
        dueDate: inst.dueDate ? new Date(inst.dueDate) : null,
      })
      .where(eq(installments.id, inst.id));
  }

  return NextResponse.json({ success: true });
}
