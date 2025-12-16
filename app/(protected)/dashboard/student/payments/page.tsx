import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  students,
  payments,
  classFeeInstallments,
  classFees,
} from "@/config/schema";
import { eq, inArray } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function PaymentsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // ✅ Get student user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "student") redirect("/dashboard");

  // ✅ Get student profile
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, user.id))
    .limit(1);

  if (!student) return notFound();

  // ✅ Load payments
  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      momoTransactionId: payments.momoTransactionId,
      installmentId: payments.installmentId,
      installmentName: classFeeInstallments.name,
      feeId: classFeeInstallments.classFeeId,
    })
    .from(payments)
    .leftJoin(
      classFeeInstallments,
      eq(payments.installmentId, classFeeInstallments.id)
    )
    .where(eq(payments.studentId, student.id));

  // ✅ Extract fee IDs safely (remove nulls)
  const feeIds = rows
    .map((r) => r.feeId)
    .filter((id): id is string => typeof id === "string");

  // ✅ Load fee metadata
  const feeRows =
    feeIds.length > 0
      ? await db
          .select()
          .from(classFees)
          .where(inArray(classFees.id, feeIds))
      : [];

  const feeMap = new Map(feeRows.map((f) => [f.id, f]));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-semibold">My Payments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {rows.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No payments found.
            </p>
          )}

          {rows.map((p) => {
          const fee = p.feeId ? feeMap.get(p.feeId) : null;

          return (
            <div
              key={p.id}
              className="border-b border-border pb-3 last:border-none"
            >
              <p className="font-medium">
                {Number(p.amount).toLocaleString()} XAF
              </p>

              <p className="text-xs text-muted-foreground">
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleString()
                  : "—"}
              </p>

              <p className="text-xs">
                Installment: {p.installmentName}
              </p>

              {fee && (
                <p className="text-xs text-muted-foreground">
                  {fee.name} — {fee.academicYear} ({fee.term})
                </p>
              )}

              <p
                className={
                  p.status === "success"
                    ? "text-green-600 text-xs font-medium"
                    : p.status === "pending"
                    ? "text-yellow-600 text-xs font-medium"
                    : "text-red-600 text-xs font-medium"
                }
              >
                {p.status}
              </p>

              {p.momoTransactionId && (
                <p className="text-[10px] text-muted-foreground">
                  Tx: {p.momoTransactionId}
                </p>
              )}
            </div>
          );
        })}

        </CardContent>
      </Card>
    </div>
  );
}
