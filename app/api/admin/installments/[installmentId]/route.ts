import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ installmentId: string }> }
) {
  try {
    const { installmentId } = await params;

    const installment = await db.query.classFeeInstallments.findFirst({
      where: eq(classFeeInstallments.id, installmentId),
      columns: {
        id: true,
        name: true,
        amount: true,
        dueDate: true,
        amountPaid: true,
        status: true,
        paidAt: true,
      },
    });

    if (!installment) {
      return NextResponse.json(
        { error: "Installment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(installment);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch installment" },
      { status: 500 }
    );
  }
}
