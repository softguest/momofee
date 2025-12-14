import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, payments, students, installments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PaymentHistoryPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      momoTransactionId: payments.momoTransactionId,
      installmentName: installments.name,
      studentName: students.firstName,
      studentLast: students.lastName,
    })
    .from(payments)
    .leftJoin(installments, eq(payments.installmentId, installments.id))
    .leftJoin(students, eq(payments.studentId, students.id))
    .where(eq(payments.studentId, payments.studentId));

  return (
    <PageShell
      sidebarItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payment History", href: "/payment/history" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No payments found.
            </p>
          )}

          {rows.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border-b border-border pb-3"
            >
              <div>
                <p className="font-medium">
                  {Number(p.amount).toLocaleString()} XAF
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* {new Date(p.createdAt).toLocaleString()} */}
                </p>
                {p.installmentName && (
                  <p className="text-xs text-muted-foreground">
                    {p.installmentName}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p
                  className={
                    p.status === "success"
                      ? "text-[color:var(--color-success,#22C55E)] text-xs font-medium"
                      : p.status === "pending"
                      ? "text-warning text-xs font-medium"
                      : "text-destructive text-xs font-medium"
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
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
