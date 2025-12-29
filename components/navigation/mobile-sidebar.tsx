"use client";

import { useState } from "react";
import { FiX, FiMenu, FiLogOut } from "react-icons/fi"; // <-- add icons
import { usePathname, useRouter } from "next/navigation";
// import type { MenuItem } from "@/types/navigation";
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiBarChart2,
  FiHelpCircle,
  FiCreditCard,
} from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconType } from "react-icons";

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

interface MobileSidebarProps {
  menu: MenuItem[];
}

export default function MobileSidebar({ menu }: MobileSidebarProps) {
    const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk(); // <-- get signOut from useClerk hook
  //  const { user } = useUser();

  const handleLogout = async () => {
    await signOut(); // signs out user
    router.push("/"); // redirect after logout
  };

       const { user } = useUser();

  
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar with menu button */}
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-card md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FiMenu size={20} />
          Menu
        </button>
      </div>

      {/* Fullscreen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col">
          {/* Header with close button */}
          <div className="flex justify-end p-4 bg-card border-b border-border">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <FiX size={22} />
              Close
            </button>
          </div>

          {/* Fullscreen menu */}
          <div className="grid grid-col-2 md-grid-col-3 overflow-y-auto bg-card p-6">
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
          </div>
        </div>
      )}
    </>
  );
}
