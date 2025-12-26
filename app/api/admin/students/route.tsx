import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { students, users, classes } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";
import { assertAdmin } from "@/lib/auth";

// export async function GET() {
//   const { userId } = await auth();

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Fetch DB user
//   const dbUser = await db.query.users.findFirst({
//     where: eq(users.id, userId),
//   });

//   if (!dbUser) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   // Ensure admin
//   assertAdmin(dbUser.role);

//   // Fetch students created by this admin
//   const result = await db.query.students.findMany({
//     where: and(
//       eq(students.createdByAdminId, dbUser.id),
//       isNull(students.deletedAt)
//     ),
//     with: {
//       class: true, // 👈 only if you defined relations
//     },
//     orderBy: (s, { desc }) => [desc(s.createdAt)],
//   });

//   return NextResponse.json(result);
// }

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
      where: and(
        eq(students.createdByAdminId, dbUser.id),
        isNull(students.deletedAt)
      ),
      // remove `with` if relations not set
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });

    console.log("Students result:", result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/admin/students error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
