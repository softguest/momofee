// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/config/db";
// import { students, users, classes } from "@/config/schema";
// import { eq } from "drizzle-orm";
// import { randomUUID } from "crypto";

// export async function POST(req: Request) {
//   const { userId: clerkUserId } =await auth();

//   if (!clerkUserId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { classId } = await req.json();

//   if (!classId) {
//     return NextResponse.json({ error: "Class is required" }, { status: 400 });
//   }

//   /* 1️⃣ Get DB user */
//   const user = await db.query.users.findFirst({
//     where: eq(users.clerkId, clerkUserId),
//   });

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   /* 2️⃣ Validate class exists */
//   const classExists = await db.query.classes.findFirst({
//     where: eq(classes.id, classId),
//   });

//   if (!classExists) {
//     return NextResponse.json({ error: "Invalid class" }, { status: 400 });
//   }

//   /* 3️⃣ Prevent duplicate student profile */
//   const existingStudent = await db.query.students.findFirst({
//     where: eq(students.userId, user.id),
//   });

//   if (existingStudent) {
//     return NextResponse.json(
//       { error: "Student profile already exists" },
//       { status: 409 }
//     );
//   }

//   /* 4️⃣ Create student */
//   await db.insert(students).values({
//     userId: user.id,
//     studentCode: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
//     classId,
//     createdByUserId: user.id, // OK if column renamed or nullable
//   });

//   return NextResponse.json({ success: true }, { status: 201 });
// }


import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    firstName,
    middleName,
    lastName,
    age,
    gender,
    classId,
  } = body;

  if (!firstName || !lastName || !age || !gender || !classId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 🔹 Get internal user
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔹 Prevent duplicate student profile
  const existing = await db.query.students.findFirst({
    where: eq(students.userId, user.id),
  });

  if (existing) {
    return NextResponse.json(
      { error: "Student profile already exists" },
      { status: 400 }
    );
  }

  await db.insert(students).values({
    userId: user.id,
    studentCode: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
    firstName,
    middleName,
    lastName,
    age,
    gender,
    classId,
    createdByUserId: user.id,
  });

  return NextResponse.json({ success: true });
}
