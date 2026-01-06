"use client";

import { useState } from "react";
import { FiX, FiMenu, FiLogOut } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
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
  const { signOut } = useClerk();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // Close menu and navigate
  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      {/* Top bar with menu button */}
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-card md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex bg-accent py-1 px-2 rounded-md  items-center gap-2 text-sm font-medium text-white hover:text-gray-900"
        >
          <FiMenu size={20} />
          Menu
        </button>
      </div>

      {/* Fullscreen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-primary/80 backdrop-blur-sm">
          {/* Header with close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-200"
            >
              <FiX size={24} />
              Close
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <nav className="space-y-4">
              {menu.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = iconMap[item.icon];

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-md text-lg font-semibold transition-colors text-white hover:bg-primary",
                      active ? "bg-accent" : ""
                    )}
                  >
                    {Icon && <Icon size={20} />}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Bottom user & logout section */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <UserButton />
                <span className="text-white font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-md text-sm font-medium text-red-200 hover:bg-red-600 hover:text-white transition-colors"
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
