import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ exists: false }, { status: 401 });
  }

  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  return NextResponse.json({
    exists: !!student,
  });
}
