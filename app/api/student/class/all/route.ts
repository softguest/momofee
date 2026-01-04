import { NextResponse } from "next/server";
import { db } from "@/config/db"; // adjust if your db export path differs
import { classes } from "@/config/schema"; // adjust path
import { isNull } from "drizzle-orm";

export async function GET() {
  try {
    const allClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
      })
      .from(classes)
      .where(isNull(classes.deletedAt))
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
