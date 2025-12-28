// import { db } from "@/config/db";
// import { users } from "@/config/schema";
// import { eq } from "drizzle-orm";

// export async function syncUser(
//   clerkUser: any,
//   role: "parent" | "student"
// ) {
//   const existing = await db
//     .select()
//     .from(users)
//     .where(eq(users.clerkId, clerkUser.id))
//     .limit(1);

//   if (existing[0]) {
//     if (existing[0].role !== role) {
//       await db
//         .update(users)
//         .set({ role })
//         .where(eq(users.clerkId, clerkUser.id));
//     }
//     return existing[0];
//   }

//   const fullName =
//     clerkUser.firstName && clerkUser.lastName
//       ? `${clerkUser.firstName} ${clerkUser.lastName}`
//       : clerkUser.username ??
//         clerkUser.emailAddresses[0]?.emailAddress ??
//         "Unknown User";

//   const [created] = await db
//     .insert(users)
//     .values({
//       id: clerkUser.id,
//       clerkId: clerkUser.id,
//       role,
//       email: clerkUser.emailAddresses[0]?.emailAddress,
//       phone: clerkUser.phoneNumbers[0]?.phoneNumber,
//     })
//     .returning();

//   return created;
// }


// lib/syncUser.ts
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function syncUser(clerkUser: {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  if (!existing) {
    await db.insert(users).values({
      id: clerkUser.id, // or randomUUID()
      clerkId: clerkUser.id,
      email: clerkUser.email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role: "student",
    });
  }
}
