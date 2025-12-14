import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { fees } from "@/config/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const [fee] = await db
    .insert(fees)
    .values({
      studentId: body.studentId,
      academicYear: body.academicYear,
      term: body.term,
      totalAmount: body.totalAmount,
      description: body.description,
    })
    .returning();

  return NextResponse.json({ feeId: fee.id });
}
