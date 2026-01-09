import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

import MobileSidebar from "@/components/navigation/mobile-sidebar";
import Sidebar from "@/components/navigation/sidebar";
import {
  adminMenu,
  parentMenu,
  studentMenu,
} from "@/components/navigation/sidebar-config";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* -------- CLERK AUTH (SAFE) -------- */
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in"); // ✅ never return null for protected routes
  }

  /* -------- LOAD USER FROM DB -------- */
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  /* -------- CREATE USER IF MISSING -------- */
  if (!user) {
    await db.insert(users).values({
      id: userId,
      clerkId: userId,
      role: "student", // default role
    });

    // 🔁 re-fetch after insert
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);
  }

  if (!user) {
    redirect("/sign-in"); // extreme edge case
  }

  /* -------- MENU RESOLUTION -------- */
  const menu =
    user.role === "admin"
      ? adminMenu
      : user.role === "parent"
      ? parentMenu
      : studentMenu;

  /* -------- RENDER -------- */
  return (
    <div className="min-h-screen flex flex-col" 
    style={{
      backgroundImage:
        "linear-gradient(rgba(228, 227, 235, 0.9), rgba(255, 255, 255, 0.9)), url('/bgmain.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    >
      <MobileSidebar menu={menu} />
      <div className="flex">
        <Sidebar menu={menu} />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}

