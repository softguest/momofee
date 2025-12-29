import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, users} from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ exists: false }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  const student = await db.query.students.findFirst({
    where: eq(students.userId, user.id),
  });

  if (!student) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    student,
  });
}