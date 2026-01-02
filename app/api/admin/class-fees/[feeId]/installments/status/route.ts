// import { NextResponse } from "next/server";
// import { db } from "@/config/db";
// import {
//   classFeeInstallments,
//   students,
//   payments,
// } from "@/config/schema";
// import { eq, isNull, and } from "drizzle-orm";

// export async function GET(
//   req: Request,
//   { params }: { params: { feeId: string } }
// ) {
//   const { feeId } = params;

//   const installments = await db
//     .select()
//     .from(classFeeInstallments)
//     .where(
//       and(
//         eq(classFeeInstallments.classFeeId, feeId),
//         isNull(classFeeInstallments.deletedAt)
//       )
//     );

//   const allStudents = await db
//     .select({
//       id: students.id,
//       firstName: students.firstName,
//       lastName: students.lastName,
//       studentCode: students.studentCode,
//     })
//     .from(students)
//     .where(isNull(students.deletedAt));

//   const paidPayments = await db
//     .select({
//       studentId: payments.studentId,
//       installmentId: payments.installmentId,
//     })
//     .from(payments)
//     .where(
//       and(
//         eq(payments.classFeeId, feeId),
//         eq(payments.status, "success"),
//         isNull(payments.deletedAt)
//       )
//     );

//   const data = installments.map(inst => ({
//     id: inst.id,
//     name: inst.name,
//     amount: inst.amount,
//     dueDate: inst.dueDate,
//     students: allStudents.map(student => ({
//       ...student,
//       status: paidPayments.some(
//         p =>
//           p.studentId === student.id &&
//           p.installmentId === inst.id
//       )
//         ? "PAID"
//         : "UNPAID",
//     })),
//   }));

//   return NextResponse.json(data);
// }


import { NextResponse } from "next/server";
import { db } from "@/config/db";
import {
  classFeeInstallments,
  students,
  payments,
} from "@/config/schema";
import { eq, isNull, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ feeId: string }> }
) {
  const { feeId } = await params;
  const now = new Date();

  // 1️⃣ Installments
  const installments = await db
    .select()
    .from(classFeeInstallments)
    .where(
      and(
        eq(classFeeInstallments.classFeeId, feeId),
        isNull(classFeeInstallments.deletedAt)
      )
    );

  // 2️⃣ Students
  const allStudents = await db
    .select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      studentCode: students.studentCode,
    })
    .from(students)
    .where(isNull(students.deletedAt));

  // 3️⃣ Successful payments
  const paidPayments = await db
    .select({
      studentId: payments.studentId,
      installmentId: payments.installmentId,
    })
    .from(payments)
    .where(
      and(
        eq(payments.classFeeId, feeId),
        eq(payments.status, "success"),
        isNull(payments.deletedAt)
      )
    );

  // 4️⃣ Build response
  const data = installments.map(inst => {
    let paidCount = 0;

    const studentsStatus = allStudents.map(student => {
      const isPaid = paidPayments.some(
        p =>
          p.studentId === student.id &&
          p.installmentId === inst.id
      );

      if (isPaid) paidCount++;

      let status: "PAID" | "UNPAID" | "OVERDUE" = "UNPAID";

      if (isPaid) {
        status = "PAID";
      } else if (inst.dueDate && inst.dueDate < now) {
        status = "OVERDUE";
      }

      return {
        ...student,
        status,
      };
    });

    return {
      id: inst.id,
      name: inst.name,
      amount: inst.amount,
      dueDate: inst.dueDate,
      paidCount,
      totalStudents: allStudents.length,
      students: studentsStatus,
    };
  });

  return NextResponse.json(data);
}
