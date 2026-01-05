import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { classFees, classes, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: Promise<{ classId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    assertAdmin(dbUser.role);

    const { classId } = await context.params;

    // Ensure class exists and belongs to admin
    const classExists = await db.query.classes.findFirst({
      where: eq(classes.id, classId),
    });

    if (!classExists) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      name,
      term,
      amount,
      description,
      academicYear,
      paymentType,
    } = body;

    if (!name || !term || !amount || !academicYear || !paymentType) {
      return NextResponse.json(
        { error: "name, term, amount, academicYear and paymentType are required" },
        { status: 400 }
      );
    }

    const fee = await db.insert(classFees).values({
      classId,
      name,
      term,
      academicYear,
      description,
      totalAmount: amount,
      paymentType, // FULL | INSTALLMENT
      createdByAdminId: dbUser.id,
    }).returning();

    return NextResponse.json(fee[0], { status: 201 });

  } catch (err: any) {
    console.error("❌ CREATE FEE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
