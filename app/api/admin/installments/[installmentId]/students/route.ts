import { NextResponse } from "next/server";
import { db } from "@/config/db";
import {
  studentInstallmentPayments,
  students,
} from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ installmentId: string }> }
) {
  const { installmentId } = await params;

  const data = await db
    .select({
      studentId: students.id,
      name: students.firstName,
    //   matricule: students.matricule,
      amountDue: studentInstallmentPayments.amountDue,
      amountPaid: studentInstallmentPayments.amountPaid,
      status: studentInstallmentPayments.status,
      paidAt: studentInstallmentPayments.paidAt,
    })
    .from(studentInstallmentPayments)
    .innerJoin(
      students,
      eq(students.id, studentInstallmentPayments.studentId)
    )
    .where(eq(studentInstallmentPayments.installmentId, installmentId));

  return NextResponse.json(data);
}
