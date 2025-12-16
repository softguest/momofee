import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students } from "@/config/schema";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();

  // Generate a new userId (or get it from your users table if already created)
  const userId = uuid();

  await db.insert(students).values({
    userId, // REQUIRED
    firstName: body.firstName,
    lastName: body.lastName,
    studentCode: body.studentCode,
    classId: body.classId,
    createdByAdminId: body.createdByAdminId || null,
  });

  return NextResponse.json({ success: true, userId });
}