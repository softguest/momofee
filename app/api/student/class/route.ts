import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { classes } from "@/config/schema";

/**
 * Fetch ALL available classes
 * Used when a student is completing their profile
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const allClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
      })
      .from(classes)
      .orderBy(classes.name);

    return NextResponse.json(allClasses); 
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
