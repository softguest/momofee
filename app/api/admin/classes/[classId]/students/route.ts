import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students, users, classes } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function POST(
    req: Request, 
    context: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

       // Fetch user from DB
       const dbUser = await db.query.users.findFirst({
         where: eq(users.id, userId)
       });
   
       if (!dbUser) {
         return NextResponse.json({ error: "User not found" }, { status: 401 });
       }
   
       assertAdmin(dbUser.role); // ✅ check DB role

    const { classId } = await context.params;
    const body = await req.json();
    const { studentClerkId, studentCode } = body; // Clerk user id + optional student code

    // Verify class exists
    const classExists = await db.query.classes.findFirst({ where: eq(classes.id, classId) });
    if (!classExists) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    // Verify student user exists
    const studentUser = await db.query.users.findFirst({ where: eq(users.clerkId, studentClerkId) });
    if (!studentUser) return NextResponse.json({ error: "Student user not found" }, { status: 404 });

    // Check if student is already in class
    const existingStudent = await db.query.students.findFirst({
      where: eq(students.userId, studentUser.id),
    });
    if (existingStudent) return NextResponse.json({ error: "Student already assigned to a class" }, { status: 409 });

    // Create student record
    const [newStudent] = await db.insert(students).values({
      userId: studentUser.id,
      classId,
      studentCode: studentCode ?? `STU-${Date.now()}`, // auto-generate code if not provided
      createdByUserId: userId,
    }).returning();

    return NextResponse.json(newStudent, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
