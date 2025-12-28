"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { FiLogOut } from "react-icons/fi";
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiBarChart2,
  FiHelpCircle,
  FiCreditCard,
} from "react-icons/fi";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconType } from "react-icons";

/* ✅ ICON MAP (CLIENT SIDE ONLY) */
const iconMap: Record<string, IconType> = {
  home: FiHome,
  analytics: FiBarChart2,
  users: FiUsers,
  layers: FiLayers,
  money: FiDollarSign,
  ticket: FiHelpCircle,
  payments: FiCreditCard,
};


interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  menu: MenuItem[];
}

export default function Sidebar({ menu }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk(); // <-- get signOut from useClerk hook
   const { user } = useUser();

  const handleLogout = async () => {
    await signOut(); // signs out user
    router.push("/"); // redirect after logout
  };

  return (
    <aside className="w-64 border-r border-border bg-card h-screen p-4 hidden md:flex flex-col justify-between">
      {/* Top navigation */}
      <nav className="space-y-1">
        {menu.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = iconMap[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-bold transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


      {/* Logout button with icon and tooltip */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 md:gap-5 pl-2">
          <UserButton />
          <span className="hidden md:block text-sm font-semibold text-gray-700">
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
