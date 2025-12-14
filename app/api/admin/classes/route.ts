import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classes } from "@/config/schema";

export async function POST(req: Request) {
  const body = await req.json();

  await db.insert(classes).values({
    name: body.name,
    description: body.description,
  });

  return NextResponse.json({ success: true });
}
