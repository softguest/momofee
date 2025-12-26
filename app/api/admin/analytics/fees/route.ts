import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  classes,
  classFees,
  payments,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  assertAdmin(admin?.role);

  const fees = await db.query.classFees.findMany();
  const allPayments = await db.query.payments.findMany({
    where: eq(payments.status, "success"),
  });

  const totalBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalCollected = allPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const outstanding = totalBilled - totalCollected;
  const collectionRate =
    totalBilled === 0
      ? 0
      : Math.round((totalCollected / totalBilled) * 100);

  // Per class breakdown
  const classData = await Promise.all(
    (await db.query.classes.findMany()).map(async (cls) => {
      const classFeesList = fees.filter(
        (f) => f.classId === cls.id
      );

      const billed = classFeesList.reduce(
        (sum, f) => sum + f.totalAmount,
        0
      );

      const classPayments = allPayments.filter((p) =>
        classFeesList.some((f) => f.id === p.classFeeId)
      );

      const collected = classPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      return {
        classId: cls.id,
        className: cls.name,
        billed,
        collected,
        outstanding: billed - collected,
        rate: billed
          ? Math.round((collected / billed) * 100)
          : 0,
      };
    })
  );

  return NextResponse.json({
    summary: {
      totalBilled,
      totalCollected,
      outstanding,
      collectionRate,
    },
    classes: classData,
  });
}
