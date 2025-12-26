import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students, studentFees, users, classFeeInstallments, } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET() {
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

    // Get student record
    const student = await db.query.students.findFirst({ where: eq(students.userId, userId) });
    if (!student) return NextResponse.json({ error: "Student record not found" }, { status: 404 });

    // Get student-specific fees
    const fees = await db.query.studentFees.findMany({
      where: eq(studentFees.studentId, student.id),
      with: {
        classFee: true,
        installments: {
          where: eq(classFeeInstallments.classFeeId, studentFees.classFeeId),
          with: { payments: true },
        },
        payments: true,
      },
    });

    return NextResponse.json({ student, fees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
