"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Child {
  id: string;
  name: string;
  className: string;
}

export function ChildSwitcher({
  childrenList,
  activeChildId,
  onChange,
}: {
  childrenList: Child[];
  activeChildId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const active = childrenList.find((c) => c.id === activeChildId);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        {active?.name}
        <span className="text-xs opacity-70">{active?.className}</span>
      </Button>

      {open && (
        <div className="absolute mt-2 w-56 rounded-md border border-border bg-card shadow-lg z-50">
          {childrenList.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                onChange(child.id);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-muted",
                child.id === activeChildId && "bg-muted"
              )}
            >
              <div className="font-medium">{child.name}</div>
              <div className="text-xs text-muted-foreground">
                {child.className}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
