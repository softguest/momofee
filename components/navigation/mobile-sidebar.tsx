"use client";

import { useState } from "react";
import { FiX, FiMenu } from "react-icons/fi"; // <-- add icons
import Sidebar from "./sidebar";
import type { MenuItem } from "@/types/navigation";
import { FiBook, FiCreditCard, FiClock, FiDatabase, FiUsers } from "react-icons/fi";
import Link from "next/link";

interface MobileSidebarProps {
  menu: MenuItem[];
}

export default function MobileSidebar({ menu }: MobileSidebarProps) {
        const steps = [
      { link: "/admin/students", label: "All Students", icon: FiUsers },
      { link: "/admin/classes", label: "All Classes", icon: FiDatabase },
      { link: "/admin/fees", label: "Fees to Pay", icon: FiCreditCard },
      { link: "/admin/analytics/overdue-installments", label: "Fee Installments", icon: FiBook },
      { link: "/admin/payments", label: "Payment History", icon: FiClock },
    ];
  
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
          <div className="grid sm:grid-col-2 md-grid-col-3 overflow-y-auto bg-card p-6">
            {steps.map((step, index) => {
            const Icon = step.icon;

           return (
              <Link
                key={index}
                href={step.link}
                className="group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
              >
                <div className="rounded-xl bg-white/10 p-6 text-center shadow hover:shadow-lg hover:scale-[1.03] transition cursor-pointer">
                  <div className="bg-primary/70 mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-accent text-2xl transition group-hover:scale-110">
                    <Icon size={28} />
                  </div>

                  <p className="font-medium text-white group-hover:text-accent transition">
                    {step.label}
                  </p>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      )}
    </>
  );
}
