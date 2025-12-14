import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students, parentsStudents, fees, payments } from "@/config/schema";
import { eq } from "drizzle-orm";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();

  await db
    .update(students)
    .set({
      firstName: body.firstName,
      lastName: body.lastName,
      className: body.className,
      studentCode: body.studentCode,
    })
    .where(eq(students.id, params.id));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: Params) {
  // Safety: prevent deletion if fees/payments exist
  const studentFees = await db
    .select()
    .from(fees)
    .where(eq(fees.studentId, params.id));

  if (studentFees.length > 0) {
    const feeIds = studentFees.map((f) => f.id);
    const studentPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, params.id));

    if (studentPayments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete student with existing payments." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Cannot delete student with existing fee records." },
      { status: 400 }
    );
  }

  // Remove links to parents
  await db
    .delete(parentsStudents)
    .where(eq(parentsStudents.studentId, params.id));

  // Delete student
  await db.delete(students).where(eq(students.id, params.id));

  return NextResponse.json({ success: true });
}
