// import { db } from "@/config/db";
// import { users } from "@/config/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { eq } from "drizzle-orm";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * POST /api/users
//  * Creates or returns the authenticated user
//  */
// export async function POST(req: NextRequest) {
//   const clerkUser = await currentUser();

//   if (!clerkUser) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const email =
//       clerkUser.emailAddresses.find(
//         (e) => e.id === clerkUser.primaryEmailAddressId
//       )?.emailAddress ?? null;

//     const body = await req.json().catch(() => ({}));
//     const role =
//       body?.role && ["admin", "student", "parent"].includes(body.role)
//         ? body.role
//         : "student";

//     const existing = await db
//       .select()
//       .from(users)
//       .where(eq(users.clerkId, clerkUser.id))
//       .limit(1);

//     if (existing.length > 0) {
//       return NextResponse.json(existing[0]);
//     }

//     const [createdUser] = await db
//       .insert(users)
//       .values({
//         id: clerkUser.id,
//         clerkId: clerkUser.id,
//         email,
//         role,
//       })
//       .returning();

//     return NextResponse.json(createdUser, { status: 201 });
//   } catch (error) {
//     console.error("Create user error:", error);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// }


import { db } from "@/config/db";
import { users } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // 1. Extract email from Clerk (always trust Clerk)
    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? null;

    const body = await req.json().catch(() => ({}));
    const role =
      body?.role && ["admin", "student", "parent"].includes(body.role)
        ? body.role
        : "student";

    // 2. Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    // 3. If user exists → UPDATE email if missing
    if (existing.length > 0) {
      const dbUser = existing[0];

      if (!dbUser.email && email) {
        const [updatedUser] = await db
          .update(users)
          .set({ email })
          .where(eq(users.clerkId, clerkUser.id))
          .returning();

        return NextResponse.json(updatedUser);
      }

      return NextResponse.json(dbUser);
    }

    // 4. If user does NOT exist → create user with email
    const [createdUser] = await db
      .insert(users)
      .values({
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email,
        role,
      })
      .returning();

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
