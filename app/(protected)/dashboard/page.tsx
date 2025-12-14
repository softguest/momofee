// app/(protected)/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { ChildSwitcher } from "@/components/parent/child-switcher";
import { db } from "@/config/db";
import {
  users,
  students,
  parentsStudents,
  fees,
  installments,
  payments,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { Router } from "next/router";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Get internal user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user) return null;

  // ----------------------------------------------------
  // Fetch linked students (supports student or parent)
  // ----------------------------------------------------

  let linkedStudents: { id: string; name: string; className: string }[] = [];

  if (user.role === "student") {
    const s = await db.select().from(students).limit(1);
    linkedStudents = s.map((st) => ({
      id: st.id,
      name: `${st.firstName} ${st.lastName}`,
      className: st.className,
    }));
  } else {
    const rows = await db
      .select({
        id: students.id,
        firstName: students.firstName,
        lastName: students.lastName,
        className: students.className,
      })
      .from(parentsStudents)
      .innerJoin(students, eq(parentsStudents.studentId, students.id))
      .where(eq(parentsStudents.parentUserId, user.id));

    linkedStudents = rows.map((r) => ({
      id: r.id,
      name: `${r.firstName} ${r.lastName}`,
      className: r.className,
    }));
  }

  const activeStudent = linkedStudents[0];

  if (!activeStudent) {
    return (
      <PageShell sidebarItems={[]}>
        <Card>
          <CardHeader>
            <CardTitle>No student linked</CardTitle>
          </CardHeader>
          <CardContent>
            Link a student profile to start managing fees.
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  // ----------------------------------------------------
  // Fetch Fee, Installments & Payments
  // ----------------------------------------------------

  const [fee] = await db
    .select()
    .from(fees)
    .where(eq(fees.studentId, activeStudent.id))
    .limit(1);

  const feeInstallments =
    fee &&
    (await db
      .select()
      .from(installments)
      .where(eq(installments.feeId, fee.id)));

  const studentPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, activeStudent.id));

  const totalPaid =
    studentPayments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  const totalAmount = fee ? Number(fee.totalAmount) : 0;
  const balance = totalAmount - totalPaid;

  // ----------------------------------------------------
  // UI Rendering
  // ----------------------------------------------------

  return (
    <PageShell
      sidebarItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payment History", href: "/payment/history" },
      ]}
    >
       {user.role === "parent" && (
        <div className="mb-6">
          <ChildSwitcher
            childrenList={linkedStudents}
            activeChildId={activeStudent.id}
            onChange={(id) => {
              // redirect to dashboard with ?child=id
              // Router.push(`/dashboard?child=${id}`);
            }}
          />
        </div>
      )}
      {/* Top summary */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {activeStudent.className}
          </p>
          <h1 className="text-xl font-semibold">
            {activeStudent.name}
          </h1>
        </div>

        <div className="flex gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Total Fee</p>
            <p className="font-semibold">{totalAmount.toLocaleString()} XAF</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Paid</p>
            <p className="font-semibold text-[color:var(--color-success,#22C55E)]">
              {totalPaid.toLocaleString()} XAF
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Balance</p>
            <p className="font-semibold text-destructive">
              {balance.toLocaleString()} XAF
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {totalAmount > 0 && (
        <div className="mb-6">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-accent"
              style={{ width: `${(totalPaid / totalAmount) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {((totalPaid / (totalAmount || 1)) * 100).toFixed(0)}% paid
          </p>
        </div>
      )}

      {/* Installments */}
      <div className="grid gap-4 md:grid-cols-2">
        {feeInstallments?.map((inst) => {
          const instPaid = studentPayments.some(
            (p) => p.installmentId === inst.id && p.status === "success"
          );

          const isOverdue =
            !!inst.dueDate && new Date(inst.dueDate) < new Date();

          // FIXED: always boolean
          const locked = !!inst.isOverdueLocked && isOverdue;

          return (
            <Card key={inst.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  {inst.name}
                </CardTitle>

                {instPaid ? (
                  <span className="text-xs font-medium text-[color:var(--color-success,#22C55E)]">
                    Paid
                  </span>
                ) : isOverdue ? (
                  <span className="text-xs font-medium text-destructive">
                    Overdue
                  </span>
                ) : (
                  <span className="text-xs font-medium text-warning">
                    Pending
                  </span>
                )}
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p>
                  Amount:{" "}
                  <span className="font-semibold">
                    {Number(inst.amount).toLocaleString()} XAF
                  </span>
                </p>

                {inst.dueDate && (
                  <p className="text-xs text-muted-foreground">
                    Deadline:{" "}
                    {new Date(inst.dueDate).toLocaleDateString()}
                  </p>
                )}

                <div className="pt-2">
                 <Button
                    disabled={instPaid || locked}
                    className="w-full"
                  >
                    <Link href={`/payment/${inst.id}/confirm`} className="w-full h-full block text-center">
                      {instPaid ? "Already Paid" : locked ? "Payment Closed" : "Pay Now"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
