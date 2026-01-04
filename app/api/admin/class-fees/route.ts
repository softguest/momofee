import { NextResponse } from "next/server";
import { db } from "@/config/db";
import {
  users,
  classFees,
  classFeeInstallments,
  classes,
} from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { assertAdmin } from "@/lib/auth";
import { eq, isNull } from "drizzle-orm";

export async function GET() {
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

    const fees = await db.query.classFees.findMany({
      where: (fees, { and }) =>
        and(
          eq(fees.createdByAdminId, dbUser.id),
          isNull(fees.deletedAt)
        ),
      with: {
        installments: true, // ✅ classFeeInstallments relation
        class: true,        // ✅ include class info (optional but useful)
      },
      orderBy: (fees, { desc }) => [desc(fees.createdAt)],
    });

    return NextResponse.json(fees);
  } catch (err: any) {
    console.error("GET /api/admin/fees error:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
