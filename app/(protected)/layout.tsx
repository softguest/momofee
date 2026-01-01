// import { currentUser } from "@clerk/nextjs/server";
// import { db } from "@/config/db";
// import { users } from "@/config/schema";
// import { eq } from "drizzle-orm"; 
// import MobileSidebar from "@/components/navigation/mobile-sidebar";
// import { adminMenu, parentMenu, studentMenu } from "@/components/navigation/sidebar-config";
// import Sidebar from "@/components/navigation/sidebar";

// export default async function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const clerkUser = await currentUser();
//   if (!clerkUser) return null;

//   const [user] = await db
//     .select()
//     .from(users)
//     .where(eq(users.clerkId, clerkUser.id))
//     .limit(1);

//   // If user doesn’t exist, insert them
//   if (!user) {
//     await db.insert(users).values({
//       id: clerkUser.id,
//       clerkId: clerkUser.id,
//       email: clerkUser.emailAddresses[0]?.emailAddress,
//       phone: clerkUser.phoneNumbers[0]?.phoneNumber,
//       role: "student", // default role if none
//     });
//   }

//   // Pick menu based on role
//   let menu;
//   switch (user?.role) {
//     case "admin":
//       menu = adminMenu;
//       break;
//     case "parent":
//       menu = parentMenu;
//       break;
//     default:
//       menu = studentMenu;
//       break;
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <MobileSidebar menu={menu} />
//       <div className="flex">
//         <Sidebar menu={menu} />
//         <div className="flex-1 p-4">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
import { currentUser } from "@clerk/nextjs/server";
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
  let clerkUser;

  /* -------- SAFE CLERK RESOLUTION -------- */
  try {
    clerkUser = await currentUser();
  } catch (err) {
    console.error("Clerk error in ProtectedLayout:", err);
    return null; // or redirect("/sign-in")
  }

  if (!clerkUser) return null;

  /* -------- LOAD OR CREATE USER -------- */
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user) {
    await db.insert(users).values({
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber ?? null,
      role: "student",
    });

    // 🔁 re-fetch user after insert
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);
  }

  if (!user) return null; // extreme edge case

  /* -------- MENU RESOLUTION -------- */
  const menu =
    user.role === "admin"
      ? adminMenu
      : user.role === "parent"
      ? parentMenu
      : studentMenu;

  /* -------- RENDER -------- */
  return (
    <div className="min-h-screen flex flex-col">
      <MobileSidebar menu={menu} />
      <div className="flex">
        <Sidebar menu={menu} />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
