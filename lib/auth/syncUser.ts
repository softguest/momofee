import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function syncUser(
  clerkUser: any,
  role: "parent" | "student"
) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (existing[0]) {
    if (existing[0].role !== role) {
      await db
        .update(users)
        .set({ role })
        .where(eq(users.clerkId, clerkUser.id));
    }
    return existing[0];
  }

  const fullName =
    clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.username ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        "Unknown User";

  const [created] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      role,
      name: fullName, // ✅ REQUIRED FIELD FIXED
      email: clerkUser.emailAddresses[0]?.emailAddress,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
    })
    .returning();

  return created;
}
