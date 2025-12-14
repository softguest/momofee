import { db } from "@/config/db";
import { students, payments, installments, fees } from "@/config/schema";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { eq, inArray } from "drizzle-orm";

import { Button } from "@/components/ui/button";

export default async function StudentReceiptsPage({
  params,
}: {
  params: { id: string };
}) {
  const studentId = params.id;

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
      installmentName: installments.name,
      feeId: payments.feeId,
    })
    .from(payments)
    .leftJoin(installments, eq(payments.installmentId, installments.id))
    .where(eq(payments.studentId, studentId));

  // Optionally join fees for year/term
  const feeMap = new Map<
    string,
    { academicYear: string | null; term: string | null }
  >();
  if (rows.length) {
    const feeIds = rows
      .map((r) => r.feeId)
      .filter(Boolean) as string[];
    if (feeIds.length) {
      const feeRows = await db
        .select()
        .from(fees)
        .where(inArray(fees.id, feeIds));
      feeRows.forEach((f) =>
        feeMap.set(f.id, {
          academicYear: f.academicYear,
          term: f.term,
        }),
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-xl font-semibold">
        Receipts — {student.firstName} {student.lastName}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Payment Receipts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {rows.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No payments available for receipts.
            </p>
          )}

          {rows.map((p) => {
            const feeMeta = p.feeId ? feeMap.get(p.feeId) : undefined;
            return (
              <div
                key={p.id}
                className="border-b border-border pb-3 last:border-none flex items-center justify-between gap-4"
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
                      Installment: {p.installmentName}
                    </p>
                  )}
                  {feeMeta && (
                    <p className="text-xs text-muted-foreground">
                      {feeMeta.academicYear} — {feeMeta.term}
                    </p>
                  )}
                  {p.momoTransactionId && (
                    <p className="text-[10px] text-muted-foreground">
                      Tx: {p.momoTransactionId}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/api/admin/students/${studentId}/receipts/${p.id}`}>
                    Download PDF
                  </a>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
