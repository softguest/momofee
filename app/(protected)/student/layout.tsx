import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Sidebar from "@/components/navigation/sidebar";
import { studentMenu } from "@/components/navigation/sidebar-config";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }
  // const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "student") redirect("/");

  return (
    <div className="flex">
      <Sidebar menu={studentMenu} />
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
