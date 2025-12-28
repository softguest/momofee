import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { classId } = body;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent duplicate student profile
  const existing = await db.query.students.findFirst({
    where: eq(students.userId, user.id),
  });

  if (existing) {
    return NextResponse.json(
      { error: "Student profile already exists" },
      { status: 400 }
    );
  }

  await db.insert(students).values({
    userId: user.id,
    studentCode: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
    classId,
    createdByAdminId: user.id, // or SYSTEM_ADMIN_ID
  });

  return NextResponse.json({ success: true });
}
