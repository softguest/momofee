import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/auth/syncUser";
import { db } from "@/config/db";
import { students, parentsStudents } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { studentCode } = await req.json();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.studentCode, studentCode))
    .limit(1);

  if (!student)
    return NextResponse.json({ error: "Invalid student code" }, { status: 400 });

  const user = await syncUser(clerkUser, "parent");

  await db.insert(parentsStudents).values({
    parentUserId: user.id,
    studentId: student.id,
  });

  return NextResponse.json({ success: true });
}
