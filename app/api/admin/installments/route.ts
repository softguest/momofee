import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  classFeeInstallments,
  classFees,
  classes,
  users,
} from "@/config/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    assertAdmin(admin.role);

    const installments = await db
      .select({
        installmentId: classFeeInstallments.id,
        installmentName: classFeeInstallments.name,
        amount: classFeeInstallments.amount,
        dueDate: classFeeInstallments.dueDate,
        createdAt: classFeeInstallments.createdAt,

        feeId: classFees.id,
        feeName: classFees.name,
        paymentType: classFees.paymentType,
        totalAmount: classFees.totalAmount,
        term: classFees.term,
        academicYear: classFees.academicYear,

        classId: classes.id,
        className: classes.name,
      })
      .from(classFeeInstallments)
      .innerJoin(classFees, eq(classFeeInstallments.classFeeId, classFees.id))
      .innerJoin(classes, eq(classFees.classId, classes.id))
      .where(isNull(classFeeInstallments.deletedAt))
      .orderBy(desc(classFeeInstallments.createdAt));

    return NextResponse.json(installments);
  } catch (err: any) {
    console.error("GET /api/admin/installments error:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
