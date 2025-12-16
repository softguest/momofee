import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  parentsStudents,
  students,
  payments,
  classFeeInstallments,
  classFees,
} from "@/config/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ParentPaymentsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // ✅ Parent user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "parent") redirect("/dashboard");

  // ✅ Children linked to parent
  const childLinks = await db
    .select({ studentId: parentsStudents.studentId })
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

  const childMap = new Map(children.map((c) => [c.id, c]));

  // ✅ Load payments for all children
  const rows = await db
    .select({
      id: payments.id,
      studentId: payments.studentId,
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
    .where(sql`${payments.studentId} IN (${sql.join(childIds, sql`,`)})`);

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

  // ✅ Group payments by child
  const grouped = new Map<string, any[]>();
  rows.forEach((p) => {
    const arr = grouped.get(p.studentId) || [];
    arr.push(p);
    grouped.set(p.studentId, arr);
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Payment History</h1>

      {children.map((child) => {
        const paymentsForChild = grouped.get(child.id) || [];

        return (
          <Card key={child.id}>
            <CardHeader>
              <CardTitle>
                {child.firstName} {child.lastName}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {paymentsForChild.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No payments found.
                </p>
              )}

              {paymentsForChild.map((p) => {
                const fee = feeMap.get(p.feeId);

                return (
                  <div
                    key={p.id}
                    className="border-b border-border pb-3 last:border-none"
                  >
                    <p className="font-medium">
                      {Number(p.amount).toLocaleString()} XAF
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleString()}
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
        );
      })}
    </div>
  );
}
