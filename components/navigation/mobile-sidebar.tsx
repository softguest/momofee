"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import type { MenuItem } from "@/types/navigation";

interface MobileSidebarProps {
  menu: MenuItem[];
}

export default function MobileSidebar({ menu }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        Menu
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 w-64 h-full bg-card border-r border-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar menu={menu} />
          </div>
        </div>
      )}
    </>
  );
}
