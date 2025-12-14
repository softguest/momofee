import * as React from "react";
import { Sidebar, type SidebarItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface PageShellProps {
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  sidebarItems,
  children,
  className,
}) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar items={sidebarItems} />
      <main
        className={cn(
          "flex-1 overflow-y-auto bg-background px-6 py-4",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};
