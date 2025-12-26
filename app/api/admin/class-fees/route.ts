import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classes, users, classFees } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { assertAdmin } from "@/lib/auth";
import { eq, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    assertAdmin(dbUser.role);

    const userClasses = await db.query.classes.findMany({
      where: eq(classes.createdBy, dbUser.id),
      with: {
        fees: {
          where: isNull(classFees.deletedAt), // only active class fees
        //   orderBy: (f, { asc }) => [f.term] // optional: sort by term
        }
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json(userClasses);
  } catch (err: any) {
    console.error("GET /api/admin/classes error:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
