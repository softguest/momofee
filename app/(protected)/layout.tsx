import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/navigation/sidebar";
import { parentMenu, studentMenu } from "@/components/navigation/sidebar-config";
import MobileSidebar from "@/components/navigation/mobile-sidebar";


export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!existing[0]) {
    await db.insert(users).values({
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      role: "parent",
    });
  }

  return (
    <div className="flex">
        {children}
    </div>
  );
}
