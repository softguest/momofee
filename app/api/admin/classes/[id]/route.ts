import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classes, students } from "@/config/schema";
import { eq, sql } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  await db
    .update(classes)
    .set({
      name: body.name,
      description: body.description,
    })
    .where(eq(classes.id, params.id));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const studentCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(students)
    .where(eq(students.classId, params.id));

  if (studentCount[0].count > 0) {
    return NextResponse.json(
      { error: "Cannot delete class with assigned students." },
      { status: 400 }
    );
  }

  await db.delete(classes).where(eq(classes.id, params.id));

  return NextResponse.json({ success: true });
}
