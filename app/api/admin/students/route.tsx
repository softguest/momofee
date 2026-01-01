import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { eq, and, isNull } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";
import { users, students } from "@/config/schema";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const { userId } = await auth();
    console.log("Logged in userId:", userId);

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    console.log("DB User:", dbUser);

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    assertAdmin(dbUser.role);

    const result = await db.query.students.findMany({
      where: isNull(students.deletedAt),
      with: {
        class: true,
      },
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });


    console.log("Students result:", result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/admin/students error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const admin = await db.query.users.findFirst({
//       where: eq(users.id, userId),
//     });

//     if (!admin) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     assertAdmin(admin.role);

//     const studentsList = await db.query.students.findMany({
//       where: isNull(students.deletedAt),
//       with: {
//         class: true, // keep this ONLY if class relation exists
//       },
//       orderBy: (s, { desc }) => [desc(s.createdAt)],
//     });

//     return NextResponse.json(studentsList);
//   } catch (error) {
//     console.error("GET /api/admin/students error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  assertAdmin(admin?.role);

  const { email, firstName, lastName, classId } = await req.json();

  const clerk = await clerkClient();

  let clerkUser;

  try {
    clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      firstName: firstName || "",
      lastName: lastName || "",
      skipPasswordChecks: true,
      publicMetadata: { role: "student" },
    });
  } catch (err: any) {
    if (err?.errors?.[0]?.code === "form_identifier_exists") {
      const existing = await clerk.users.getUserList({
        emailAddress: [email],
      });

      clerkUser = existing.data[0];
    } else {
      throw err;
    }
  }

  const [dbUser] = await db.insert(users).values({
    id: clerkUser.id,
    clerkId: clerkUser.id,
    role: "student",
    email,
  }).returning();

  const [student] = await db.insert(students).values({
    userId: dbUser.id,
    classId,
    studentCode: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdByUserId: admin!.id,
  }).returning();

  return NextResponse.json(student, { status: 201 });
}

