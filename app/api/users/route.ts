import { db } from "@/config/db";
import { users } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/users
 * Creates or returns the authenticated user
 */
export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    // 1️⃣ Extract & normalize data from Clerk
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ?? null;

    const firstName =
      clerkUser.firstName ??
      clerkUser.fullName?.split(" ")[0] ??
      "Unknown";

    const lastName =
      clerkUser.lastName ??
      clerkUser.fullName?.split(" ").slice(1).join(" ") ??
      "User";

    // 2️⃣ Optional role from request body
    const body = await req.json().catch(() => ({}));
    const role =
      body?.role && ["admin", "student", "parent"].includes(body.role)
        ? body.role
        : "student"; // default role

    // 3️⃣ Check if user already exists (by clerkId)
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    // 4️⃣ Create new user
    const [createdUser] = await db
      .insert(users)
      .values({
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email,
        firstName,
        lastName,
        role,
      })
      .returning();

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
