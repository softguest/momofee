import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/auth/syncUser";
import { db } from "@/config/db";
import { students } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await syncUser(clerkUser, "student");

  // Auto-link student by email or phone
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.studentCode, clerkUser.username || "")) // or email/phone mapping
    .limit(1);

  if (!student)
    return NextResponse.json(
      { error: "Student profile not found. Contact admin." },
      { status: 400 }
    );

  return NextResponse.json({ success: true });
}
