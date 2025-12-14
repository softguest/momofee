import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { students } from "@/config/schema";


export async function POST(req: Request) {
  const body = await req.json();

  await db.insert(students).values({
    firstName: body.firstName,
    lastName: body.lastName,
    className: body.className,
    studentCode: body.studentCode,
  });

  return NextResponse.json({ success: true });
}
