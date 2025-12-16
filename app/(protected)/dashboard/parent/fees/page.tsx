import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  parentsStudents,
  students,
  classes,
  classFees,
  classFeeInstallments,
  payments,
} from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ParentFeesPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // ✅ Find parent user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "parent") {
    redirect("/dashboard");
  }

  // ✅ Find all children linked to this parent
  const childLinks = await db
    .select({
      studentId: parentsStudents.studentId,
    })
    .from(parentsStudents)
    .where(eq(parentsStudents.parentUserId, user.id));

  if (childLinks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <p className="text-muted-foreground text-sm">
          No children linked to your account yet.
        </p>
      </div>
    );
  }

  const childIds = childLinks.map((c) => c.studentId);

  // ✅ Load student profiles
  const children = await db
    .select()
    .from(students)
    .where(sql`${students.id} IN (${sql.join(childIds, sql`,`)})`);

  // ✅ Load classes for all children
  const classIds = children.map((c) => c.classId);

  const classRows = await db
    .select()
    .from(classes)
    .where(sql`${classes.id} IN (${sql.join(classIds, sql`,`)})`);

  const classMap = new Map(classRows.map((c) => [c.id, c]));

  // ✅ Load fees for all classes
  const feeRows = await db
    .select()
    .from(classFees)
    .where(sql`${classFees.classId} IN (${sql.join(classIds, sql`,`)})`);

  const feeMap = new Map<string, any[]>();
  feeRows.forEach((f) => {
    const arr = feeMap.get(f.classId) || [];
    arr.push(f);
    feeMap.set(f.classId, arr);
  });

  // ✅ Load installments for all fees
  const feeIds = feeRows.map((f) => f.id);

  const installmentRows = await db
    .select()
    .from(classFeeInstallments)
    .where(sql`${classFeeInstallments.classFeeId} IN (${sql.join(feeIds, sql`,`)})`);

  const installmentMap = new Map<string, any[]>();
  installmentRows.forEach((i) => {
    const arr = installmentMap.get(i.classFeeId) || [];
    arr.push(i);
    installmentMap.set(i.classFeeId, arr);
  });

  // ✅ Load payments for all children
  const paymentRows = await db
    .select()
    .from(payments)
    .where(sql`${payments.studentId} IN (${sql.join(childIds, sql`,`)})`);

  const paymentMap = new Map<string, number>();
  paymentRows.forEach((p) => {
    const prev = paymentMap.get(p.installmentId) || 0;
    paymentMap.set(p.installmentId, prev + Number(p.amount));
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">My Children’s Fees</h1>

      {children.map((child) => {
        const cls = classMap.get(child.classId);
        const fees = feeMap.get(child.classId) || [];

        return (
          <Card key={child.id}>
            <CardHeader>
              <CardTitle>
                {/* {child.firstName} {child.lastName} — {cls.name} */}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">
              {fees.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No fees assigned for this class.
                </p>
              )}

              {fees.map((fee) => {
                const installments = installmentMap.get(fee.id) || [];

                return (
                  <div key={fee.id} className="space-y-3">
                    <p className="font-medium">
                      {fee.name} — {fee.academicYear} ({fee.term})
                    </p>

                    {installments.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No installments defined.
                      </p>
                    )}

                    {installments.map((inst) => {
                      const paid = paymentMap.get(inst.id) || 0;
                      const remaining = inst.amount - paid;

                      const status =
                        paid >= inst.amount
                          ? "paid"
                          : inst.dueDate && new Date(inst.dueDate) < new Date()
                          ? "overdue"
                          : "pending";

                      return (
                        <div
                          key={inst.id}
                          className="border-b border-border pb-3 last:border-none"
                        >
                          <p className="font-medium">{inst.name}</p>

                          <p className="text-xs">
                            {paid.toLocaleString()} /{" "}
                            {inst.amount.toLocaleString()} XAF
                          </p>

                          {inst.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(inst.dueDate).toLocaleDateString()}
                            </p>
                          )}

                          <p
                            className={
                              status === "paid"
                                ? "text-green-600 text-xs font-medium"
                                : status === "overdue"
                                ? "text-red-600 text-xs font-medium"
                                : "text-yellow-600 text-xs font-medium"
                            }
                          >
                            Status: {status}
                          </p>

                          {status !== "paid" && (
                            <a
                              href={`/parent/pay/${inst.id}?studentId=${child.id}`}
                              className="text-sm text-accent underline"
                            >
                              Pay Now
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
