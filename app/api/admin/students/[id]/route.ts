import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students, users, classes } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await context.params;
    // const studentId = params.id;

    const [result] = await db
      .select({
        /* ---------- STUDENT ---------- */
        id: students.id,
        studentCode: students.studentCode,
        firstName: students.firstName,
        middleName: students.middleName,
        lastName: students.lastName,
        age: students.age,
        gender: students.gender,
        createdAt: students.createdAt,

        /* ---------- CLASS ---------- */
        classId: students.classId,
        className: classes.name,
        academicYear: classes.academicYear,

        /* ---------- USER ---------- */
        userId: users.id,
        role: users.role,
        userName: users.userName,
        email: users.email,
        phone: users.phone,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .innerJoin(classes, eq(students.classId, classes.id))
      .where(
        and(
          eq(students.id, id),
          isNull(students.deletedAt),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    if (!result) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("STUDENT DETAIL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
