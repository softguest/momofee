import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, classes } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      description: classes.description,
      academicYear: classes.academicYear,
      createdAt: classes.createdAt,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.userId, userId))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json(
      { error: "Student not assigned to a class" },
      { status: 404 }
    );
  }

  return NextResponse.json(result[0]); // ✅ NOT array
}
