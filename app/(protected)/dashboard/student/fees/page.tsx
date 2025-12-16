import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  classes,
  classFees,
  classFeeInstallments,
  payments,
} from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function FeesPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // ✅ Find the student user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "student") {
    redirect("/dashboard");
  }

  // ✅ Find student profile
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, user.id))
    .limit(1);

  if (!student) return notFound();

  // ✅ Load class
  const [cls] = await db
    .select()
    .from(classes)
    .where(eq(classes.id, student.classId))
    .limit(1);

  // ✅ Load all class fees
  const fees = await db
    .select()
    .from(classFees)
    .where(eq(classFees.classId, cls.id));

  // ✅ Load installments for all fees
  const installments = await db
    .select()
    .from(classFeeInstallments)
    .where(
      sql`${classFeeInstallments.classFeeId} IN (${sql.join(
        fees.map((f) => f.id),
        sql`,`
      )})`
    );

  // ✅ Load student payments
  const studentPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, student.id));

  // ✅ Build a map of payments per installment
  const paymentMap = new Map<string, number>();
  studentPayments.forEach((p) => {
    const prev = paymentMap.get(p.installmentId) || 0;
    paymentMap.set(p.installmentId, prev + Number(p.amount));
  });

  // ✅ Group installments by fee
  const feeGroups = fees.map((fee) => ({
    fee,
    installments: installments.filter((i) => i.classFeeId === fee.id),
  }));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">
        My Fees — {cls.name}
      </h1>

      {feeGroups.map(({ fee, installments }) => (
        <Card key={fee.id}>
          <CardHeader>
            <CardTitle>
              {fee.name} — {fee.academicYear} ({fee.term})
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            {installments.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No installments defined for this fee.
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
                      href={`/student/pay/${inst.id}`}
                      className="text-sm text-accent underline"
                    >
                      Pay Now
                    </a>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
