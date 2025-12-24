import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classes } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { users } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user from DB
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    assertAdmin(dbUser.role); // ✅ check DB role

    const body = await req.json();
    const { name, academicYear, description } = body;

    if (!name || !academicYear) {
      return NextResponse.json(
        { error: "Name and academic year are required" },
        { status: 400 }
      );
    }

    const existing = await db.query.classes.findFirst({
      where: and(
        eq(classes.name, name),
        eq(classes.academicYear, academicYear)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Class already exists for this academic year" },
        { status: 409 }
      );
    }

    const [createdClass] = await db
      .insert(classes)
      .values({ name, academicYear, description })
      .returning();

    return NextResponse.json(createdClass, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}

