// // app/api/payment/[installmentId]/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFeeInstallments, classFees, payments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ installmentId: string }> }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { installmentId } = await params;

  // Get studentId from request body
  const body = await req.json();
  const studentId: string | undefined = body.studentId;

  if (!studentId) {
    return new NextResponse("Missing studentId", { status: 400 });
  }

  // Fetch installment
  const [inst] = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.id, installmentId))
    .limit(1);

  if (!inst) {
    return new NextResponse("Installment not found", { status: 404 });
  }

  // Fetch the class fee linked to this installment
  const [fee] = await db
    .select()
    .from(classFees)
    .where(eq(classFees.id, inst.classFeeId))
    .limit(1);

  if (!fee) {
    return new NextResponse("Fee not found", { status: 404 });
  }

  const amount = Number(inst.amount);

  // Insert payment record
  const [payment] = await db
    .insert(payments)
    .values({
      studentId,
      installmentId: inst.id,
      amount,
      status: "pending",
    })
    .returning();

  return NextResponse.redirect(
    new URL(`/payment/success?paymentId=${payment.id}`, req.url)
  );
}
