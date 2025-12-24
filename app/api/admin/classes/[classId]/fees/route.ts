import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { classFees, classes } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { users } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

export async function POST(
    req: Request, 
    context: { params: Promise<{ classId: string }> }
)  {
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

    const { classId } = await context.params;
    const body = await req.json();
    const { name, amount, term, description } = body;

    if (!name || !amount || !term) {
      return NextResponse.json({ error: "Name, amount, and term are required" }, { status: 400 });
    }

    // Verify class exists
    const classExists = await db.query.classes.findFirst({
      where: eq(classes.id, classId),
    });
    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Prevent duplicate fee for same class & term
    const existingFee = await db.query.classFees.findFirst({
      where: and(
        eq(classFees.classId, classId),
        eq(classFees.name, name),
        eq(classFees.term, term)
      ),
    });

    if (existingFee) {
      return NextResponse.json({ error: "Fee already exists for this class and term" }, { status: 409 });
    }

    // Create fee
    const [newFee] = await db.insert(classFees).values({
      classId,
      name,
      amount,
      term,
      description,
    }).returning();

    return NextResponse.json(newFee, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
