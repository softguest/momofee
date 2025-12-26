import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Sidebar from "@/components/navigation/sidebar";
import { adminMenu } from "@/components/navigation/sidebar-config";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  if (!clerkUser) redirect("/sign-in");
  
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "admin") redirect("/student");

  return (
    <div className="flex">
      <Sidebar menu={adminMenu} />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
