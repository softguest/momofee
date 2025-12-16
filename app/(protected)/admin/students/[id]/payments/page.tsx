import { db } from "@/config/db";
import { students, payments, classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function StudentPaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = id;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) return notFound();

  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      momoTransactionId: payments.momoTransactionId,
      installmentName: classFeeInstallments.name,
    })
    .from(payments)
    .leftJoin(classFeeInstallments, eq(payments.installmentId, classFeeInstallments.id))
    .where(eq(payments.studentId, studentId));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-xl font-semibold">
        Payments — {student.firstName} {student.lastName}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {rows.length === 0 && (
            <p className="text-muted-foreground text-xs">No payments found.</p>
          )}

          {rows.map((p) => (
            <div key={p.id} className="border-b border-border pb-3 last:border-none">
              <p className="font-medium">
                {Number(p.amount).toLocaleString()} XAF
              </p>

              <p className="text-xs text-muted-foreground">
                {/* {new Date(p.createdAt).toLocaleString()} */}
              </p>

              {p.installmentName && (
                <p className="text-xs text-muted-foreground">
                  Installment: {p.installmentName}
                </p>
              )}

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
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
