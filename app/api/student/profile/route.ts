import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { classes } from "@/config/schema";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    firstName,
    middleName,
    lastName,
    age,
    gender,
    classId,
  } = body;

  if (!firstName || !lastName || !age || !gender || !classId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 🔹 Get internal user
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔹 Prevent duplicate student profile
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
    firstName,
    middleName,
    lastName,
    age,
    gender,
    classId,
    createdByUserId: user.id,
  });

  return NextResponse.json({ success: true });
}


/**
 * Fetch ALL available classes
 * Used when a student is completing their profile
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const allClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
      })
      .from(classes)
      .orderBy(classes.name);

    return NextResponse.json(allClasses); 
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

