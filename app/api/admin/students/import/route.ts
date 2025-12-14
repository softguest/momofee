import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students } from "@/config/schema";

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
  const required = [
    "first_name",
    "last_name",
    "class_name",
    "student_code",
  ];

  const missing = required.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing columns: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const indices = Object.fromEntries(
    header.map((h, i) => [h, i] as const)
  );

  let inserted = 0;

  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    if (cols.length < header.length) continue;

    const firstName = cols[indices["first_name"]]?.trim();
    const lastName = cols[indices["last_name"]]?.trim();
    const className = cols[indices["class_name"]]?.trim();
    const studentCode = cols[indices["student_code"]]?.trim();

    if (!firstName || !lastName || !className || !studentCode) continue;

    await db.insert(students).values({
      firstName,
      lastName,
      className,
      studentCode,
    });

    inserted++;
  }

  return NextResponse.json({ inserted });
}
