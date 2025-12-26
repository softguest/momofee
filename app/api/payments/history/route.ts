import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { payments, students, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { InferSelectModel } from "drizzle-orm";

type Payment = InferSelectModel<typeof payments>;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let result: Payment[] = [];

  if (dbUser.role === "student") {
    const student = await db.query.students.findFirst({
      where: eq(students.userId, dbUser.id),
    });

    if (!student) {
      return NextResponse.json([], { status: 200 });
    }

    result = await db.query.payments.findMany({
      where: eq(payments.studentId, student.id),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
  }

  return NextResponse.json(result);
}
