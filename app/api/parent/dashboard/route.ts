import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  parentsStudents,
  students,
  classes,
  classFees,
  payments,
} from "@/config/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parent = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!parent || parent.role !== "parent") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Linked students
  const links = await db.query.parentsStudents.findMany({
    where: eq(parentsStudents.parentUserId, parent.id),
  });

  const studentIds = links.map((l) => l.studentId);

  if (studentIds.length === 0) {
    return NextResponse.json([]);
  }

  const studentList = await db.query.students.findMany({
    where: inArray(students.id, studentIds),
    with: {
      class: true,
    },
  });

  // Attach fees + payments
  const result = [];

  for (const student of studentList) {
    const fees = await db.query.classFees.findMany({
      where: eq(classFees.classId, student.classId),
    });

    const studentPayments = await db.query.payments.findMany({
      where: eq(payments.studentId, student.id),
    });

    result.push({
      student,
      fees,
      payments: studentPayments,
    });
  }

  return NextResponse.json(result);
}
