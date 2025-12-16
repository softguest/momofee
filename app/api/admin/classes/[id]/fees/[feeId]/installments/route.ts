import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFeeInstallments } from "@/config/schema";

interface Params {
  id: string;
  feeId: string;
}

export async function POST(
  req: Request,
  context: { params: Promise<Params> }
) {
  const params = await context.params;
  const body = await req.json();

  await db.insert(classFeeInstallments).values({
    classFeeId: params.feeId,
    name: body.name,
    amount: Number(body.amount),
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
  });

  return NextResponse.json({ success: true });
}
