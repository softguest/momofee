import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, students } from "@/config/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import {
  FiBook,
  FiCreditCard,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiUser,
  FiLayers,
  FiSettings,
} from "react-icons/fi";
import Link from "next/link";
import ProfileComponent from "@/components/ProfileComponent";
import StudentFeeLoop from "@/components/StudentFeeLoop";

const DashboardPage = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

    if (!user) {
      redirect("/sign-in");
    }

  // 🔍 Check if student profile exists
  let studentRecord = null;

  if (user.role === "student") {
    [studentRecord] = await db
      .select()
      .from(students)
      .where(eq(students.userId, user.id)) // 👈 change if you use clerkId
      .limit(1);
  }

  const adminSteps = [
    { link: "/admin/students", label: "All Students", icon: FiUsers },
    { link: "/admin/classes", label: "All Classes", icon: FiLayers },
    { link: "/admin/fees", label: "Fees to Pay", icon: FiCreditCard },
    { link: "/admin/installments", label: "Fee Installments", icon: FiBook },
    { link: "/admin/payments", label: "Payment History", icon: FiClock },
  ];

  const studentSteps = [
    { link: "/student/classes", label: "My Class", icon: FiUser },
    { link: "/student/fees", label: "Fees to Pay", icon: FiDollarSign },
    { link: "/student/profile", label: "Student Profile", icon: FiBook },
    { link: "/student/payments", label: "Payment History", icon: FiClock },
  ];

  return (
    <div className="max-w-5xl mx-auto py-2 md:py-8 space-y-8">
      {/* ================= ADMIN ================= */}
      {user.role === "admin" && (
        <>
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <div>Admin Dashboard</div>
            <FiSettings />
          </h1>

          <div className="bg-primary p-2 md:p-8 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {adminSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Link key={index} href={step.link}>
                    <div className="bg-white/10 rounded-xl p-6 text-center hover:scale-105 transition">
                      <Icon className="mx-auto mb-3 text-accent" size={26} />
                      <p className="text-white">{step.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ================= PARENT ================= */}
      {user.role === "parent" && (
        <div className="text-green-600 font-semibold">
          Parent Page (Parent)
        </div>
      )}

      {/* ================= STUDENT ================= */}
      {user.role === "student" && (
        <>
          {/* 🚨 No student record → force profile completion */}
          {!studentRecord ? (
            <ProfileComponent />
          ) : (
            <>
              <h1 className="text-2xl font-semibold flex items-center space-x-2">
                <div>Student Dashboard</div>
                <FiSettings />
              </h1>

              <div className="bg-primary p-4 md:p-8 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {studentSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <Link key={index} href={step.link}>
                        <div className="bg-white/10 rounded-xl p-6 text-center hover:scale-105 transition">
                          <Icon className="mx-auto mb-3 text-accent" size={26} />
                          <p className="text-white">{step.label}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <StudentFeeLoop />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
