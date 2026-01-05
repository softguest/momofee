import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFees, classFeeInstallments, studentInstallmentPayments, users } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql, and  } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

interface InstallmentBody {
  name: string;
  amount: number;
  dueDate?: string;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ feeId: string }> }
) {
  try {
    // --- Clerk auth ---
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Fetch user from DB ---
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    assertAdmin(dbUser.role); // ✅ ensure admin

    // --- Get feeId from dynamic route ---
    const { feeId } = await context.params;

    // --- Parse request body ---
    const body: InstallmentBody = await req.json();
    const { name, amount, dueDate } = body;

    if (!name || !amount) {
      return NextResponse.json(
        { error: "Name and amount are required" },
        { status: 400 }
      );
    }

    // --- Verify class fee exists ---
    const fee = await db.query.classFees.findFirst({
      where: eq(classFees.id, feeId),
    });

    if (!fee) {
      return NextResponse.json({ error: "Class fee not found" }, { status: 404 });
    }

    // --- Sum existing installments ---
    const [sumRow] = await db
      .select({
        total: sql<number>`SUM(${classFeeInstallments.amount})`
      })
      .from(classFeeInstallments)
      .where(eq(classFeeInstallments.classFeeId, feeId))

    const totalInstalled = sumRow?.total ?? 0;

    if (totalInstalled + amount > fee.totalAmount) {
      return NextResponse.json(
        { error: "Installments cannot exceed total fee amount" },
        { status: 400 }
      );
    }

    // --- Create new installment ---
    const [newInstallment] = await db
      .insert(classFeeInstallments)
      .values({
        classFeeId: feeId,
        name,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning();

    return NextResponse.json(newInstallment, { status: 201 });
  } catch (error: any) {
    console.error("Create installment error:", error);
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ feeId: string }> }
) {
  const {feeId} = await context.params;
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "studentId is required" },
      { status: 400 }
    );
  }

  const installments = await db
    .select({
      id: classFeeInstallments.id,
      name: classFeeInstallments.name,
      amount: classFeeInstallments.amount,
      dueDate: classFeeInstallments.dueDate,

      amountPaid: studentInstallmentPayments.amountPaid,
      status: studentInstallmentPayments.status,
      paidAt: studentInstallmentPayments.paidAt,
    })
    .from(classFeeInstallments)
    .leftJoin(
      studentInstallmentPayments,
      and(
        eq(studentInstallmentPayments.installmentId, classFeeInstallments.id),
        eq(studentInstallmentPayments.studentId, studentId)
      )
    )
    .where(eq(classFeeInstallments.classFeeId, feeId));

  const today = new Date();

  const formatted = installments.map((i) => {
    const isOverdue =
      !i.status &&
      i.dueDate &&
      new Date(i.dueDate) < today;

    return {
      ...i,
      status: i.status ?? (isOverdue ? "OVERDUE" : "UNPAID"),
    };
  });

  return NextResponse.json(formatted);
}