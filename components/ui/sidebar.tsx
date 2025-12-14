"use client"
import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, footer }) => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <span className="text-sm font-semibold tracking-tight">
          MOMO Fee Dashboard
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3 text-sm">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {item.icon && (
                <span className="text-xs opacity-80">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer && (
        <div className="border-t border-sidebar-border p-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </aside>
  );
};
