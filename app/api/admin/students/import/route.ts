import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { users, students } from "@/config/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length <= 1) {
    return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
  }

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const required = ["first_name", "last_name", "class_id", "student_code"];

  const missing = required.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing columns: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const indices = Object.fromEntries(header.map((h, i) => [h, i] as const));

  let inserted = 0;

  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    if (cols.length < header.length) continue;

    const firstName = cols[indices["first_name"]]?.trim();
    const lastName = cols[indices["last_name"]]?.trim();
    const classId = cols[indices["class_id"]]?.trim();
    const studentCode = cols[indices["student_code"]]?.trim();

    if (!firstName || !lastName || !classId || !studentCode) continue;

    // ✅ Create user first
    const userId = uuid();
      await db.insert(users).values({
      id: userId,
      name: `${firstName} ${lastName}`, // Combine
      role: "student",
      clerkId: "SOME_CLERK_ID", // required
    });

    // ✅ Create student linked to user
    await db.insert(students).values({
      userId,
      classId,
      studentCode,
      firstName,
      lastName,
      createdByAdminId: "ADMIN_ID_HERE",
    });
    inserted++;
  }

  return NextResponse.json({ inserted });
}
