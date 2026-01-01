import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFees, classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ classId: string }>}
) {
  const {classId} = await context.params;
  const fees = await db.query.classFees.findMany({
    where: eq(classFees.classId, classId),
    with: {
      // installments: true,
    },
    orderBy: (fees, { desc }) => [desc(fees.createdAt)],
  });

  return NextResponse.json(fees);
}
