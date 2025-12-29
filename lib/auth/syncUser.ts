// lib/syncUser.ts
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function syncUser(clerkUser: {
  id: string;
  email?: string;
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  if (!existing) {
    await db.insert(users).values({
      id: clerkUser.id, // or randomUUID()
      clerkId: clerkUser.id,
      email: clerkUser.email,
      role: "student",
    });
  }
}
