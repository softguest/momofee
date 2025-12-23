import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Sidebar from "@/components/navigation/sidebar";
import { parentMenu, studentMenu } from "@/components/navigation/sidebar-config";
import DashboardHeader from "@/components/DashboardHeader";


export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  const menu = user.role === "parent" ? parentMenu : studentMenu;

  return (
    <div className="flex">
      <Sidebar menu={menu} />
      <div className="flex-1 p-4">
        {/* <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} /> */}
        {children}
      </div>
    </div>
  );
}
