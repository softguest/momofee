import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { payments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: any) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, params.paymentId))
    .limit(1);

  if (!payment) {
    return NextResponse.json({ status: "not_found" });
  }

  return NextResponse.json({ status: payment.status });
}
