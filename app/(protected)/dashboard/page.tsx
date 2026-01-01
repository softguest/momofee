import React from 'react'
import { currentUser } from "@clerk/nextjs/server";
import {db} from "@/config/db"
import { users } from "@/config/schema";
import {eq} from "drizzle-orm"
import { FiBook, FiCreditCard, FiClock, FiDollarSign, FiUsers, FiUser, FiLayers, FiSettings } from "react-icons/fi";
import Link from 'next/link';


const DashboardPage = async () => {
   const clerkUser = await currentUser();
    if (!clerkUser) return null;
  
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    const adminSteps = [
        { link: "/admin/students", label: "All Students", icon: FiUsers },
        { link: "/admin/classes", label: "All Classes", icon: FiLayers},
        { link: "/admin/fees", label: "Fees to Pay", icon: FiCreditCard },
        { link: "/admin/installments", label: "Fee Installments", icon: FiBook },
        { link: "/admin/payments", label: "Payment History", icon: FiClock },
      ];

    const studentSteps = [
        { link: "/student/classes", label: "Student's Class", icon: FiUser },
        { link: "/student/fees", label: "Fees to Pay", icon: FiDollarSign},
        { link: "/student/profile", label: "Student Profile", icon: FiBook },
        { link: "/student/payments", label: "Payment History", icon: FiClock },
      ];

  return (
    <div className="max-w-5xl mx-auto py-2 md:py-8 space-y-8">
      {user.role === "admin" && (
        <>
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
              <div>Admin Dashboard</div><FiSettings />
          </h1>
          <div className="bg-primary p-2 md:p-8 space-y-8 rounded-md">
            <div className="p-2 md:p-8 space-y-8 rounded-2xl">
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {adminSteps.map((step, index) => {
                  const Icon = step.icon;

                return (
                    <Link
                      key={index}
                      href={step.link}
                      className="group opacity-0 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                    >
                      <div className="bg-primary rounded-xl bg-white/10 p-6 text-center shadow hover:shadow-lg hover:scale-[1.03] transition cursor-pointer">
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
          </div>
        </>
      )}
      {user.role === "parent" && (
        <div className="text-green-600 font-semibold">
          Parent Page (Parent)
        </div>
      )}
      {user.role === "student" && (
        <>
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <div>Student Dashboard</div><FiSettings />
          </h1>
          <div className="bg-primary max-w-5xl mx-auto p-4 md:p-8 space-y-8 rounded-md">
            <div className="p-2 md:p-8 space-y-8 rounded-2xl">
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {studentSteps.map((step, index) => {
                  const Icon = step.icon;

                return (
                    <Link
                      key={index}
                      href={step.link}
                      className="group opacity-0 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                    >
                      <div className="bg-primary rounded-xl bg-white/10 p-6 text-center shadow hover:shadow-lg hover:scale-[1.03] transition cursor-pointer">
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
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage