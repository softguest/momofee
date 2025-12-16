import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, studentNotes } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Empty content" }, { status: 400 });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const [note] = await db
    .insert(studentNotes)
    .values({
      studentId,
      authorUserId: user.id,
      content,
    })
    .returning({
      id: studentNotes.id,
      content: studentNotes.content,
      createdAt: studentNotes.createdAt,
    });

  return NextResponse.json({
    note: {
      ...note,
      authorEmail: user.email,
    },
  });
}
