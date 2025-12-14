import { db } from "@/config/db";
import { users } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, user.primaryEmailAddress?.emailAddress || ""));

    if (existing.length === 0) {
      // Create new user
      const result = await db
        .insert(users)
        .values({
          name: user.fullName || "No name",
          email: user.primaryEmailAddress?.emailAddress || "No email",
          clerkId: user.id,               // REQUIRED
          role: "student",                // REQUIRED — choose default
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(existing[0]);
  } catch (e) {
    console.error("Create user error:", e);
    return NextResponse.json({ error: e });
  }
}
