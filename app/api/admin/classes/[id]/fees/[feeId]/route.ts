import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFees, classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";

interface Params {
  id: string;
  feeId: string;
}

// ✅ GET
export async function GET(
  req: Request,
  context: { params: Promise<Params> }
) {
  const { feeId } = await context.params;

  const [fee] = await db
    .select()
    .from(classFees)
    .where(eq(classFees.id, feeId))
    .limit(1);

  if (!fee) {
    return NextResponse.json({ error: "Fee not found" }, { status: 404 });
  }

  return NextResponse.json({ fee });
}

// ✅ PUT
export async function PUT(
  req: Request,
  context: { params: Promise<Params> }
) {
  const { feeId } = await context.params;
  const body = await req.json();

  await db
    .update(classFees)
    .set({
      name: body.name,
      academicYear: body.academicYear,
      term: body.term,
      amount: Number(body.amount),
    })
    .where(eq(classFees.id, feeId));

  return NextResponse.json({ success: true });
}

// ✅ DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<Params> }
) {
  const { feeId } = await context.params;

  const installments = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.classFeeId, feeId));

  if (installments.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete fee with existing installments. Delete installments first." },
      { status: 400 }
    );
  }

  await db.delete(classFees).where(eq(classFees.id, feeId));

  return NextResponse.json({ success: true });
}
