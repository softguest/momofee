import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { users, parentsStudents } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const [parentUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!parentUser) {
    return NextResponse.json(
      { error: "Parent user not found" },
      { status: 404 }
    );
  }

  const [link] = await db
    .insert(parentsStudents)
    .values({
      parentUserId: parentUser.id,
      studentId,
    })
    .returning({
      linkId: parentsStudents.id,
      parentId: parentsStudents.parentUserId,
    });

  return NextResponse.json({
    link: {
      ...link,
      email: parentUser.email,
      phone: parentUser.phone,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // ensures route param is resolved (even if unused)

  const { linkId } = await req.json();

  if (!linkId) {
    return NextResponse.json(
      { error: "linkId is required" },
      { status: 400 }
    );
  }

  await db
    .delete(parentsStudents)
    .where(eq(parentsStudents.id, linkId));

  return NextResponse.json({ success: true });
}
