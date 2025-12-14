// app/api/payment/[installmentId]/start/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { installments, fees, payments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { installmentId: string } }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

  const [inst] = await db
    .select()
    .from(installments)
    .where(eq(installments.id, params.installmentId))
    .limit(1);

  if (!inst) return new NextResponse("Not Found", { status: 404 });

  const [fee] = await db
    .select()
    .from(fees)
    .where(eq(fees.id, inst.feeId))
    .limit(1);

  if (!fee) return new NextResponse("Fee Not Found", { status: 404 });

  const amount = Number(inst.amount);

  // FIXED INSERT
  const [payment] = await db
    .insert(payments)
    .values({
      studentId: fee.studentId,
      feeId: fee.id,
      installmentId: inst.id,
      amount: String(amount),        // <-- CRITICAL FIX
      status: "pending",
      type: "installment",
    })
    .returning();

  return NextResponse.redirect(
    new URL(`/payment/success?paymentId=${payment.id}`, req.url)
  );
}
