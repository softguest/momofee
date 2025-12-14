// app/(protected)/payment/[installmentId]/confirm/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/config/db";
import { installments, fees, students } from "@/config/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  params: { installmentId: string };
}

export default async function ConfirmPaymentPage({ params }: Props) {
  const [inst] = await db
    .select()
    .from(installments)
    .where(eq(installments.id, params.installmentId))
    .limit(1);

  if (!inst) return notFound();

  const [fee] = await db.select().from(fees).where(eq(fees.id, inst.feeId));
  if (!fee) return notFound();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, fee.studentId));

  const amount = Number(inst.amount);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Confirm Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">
              Student
            </p>
            <p className="font-medium">
              {student?.firstName} {student?.lastName} — {student?.className}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">
              Installment
            </span>
            <span className="font-medium">{inst.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">
              Amount
            </span>
            <span className="font-semibold">
              {amount.toLocaleString()} XAF
            </span>
          </div>

          {inst.dueDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">
                Deadline
              </span>
              <span className="text-xs">
                {new Date(inst.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="pt-6 flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <form action={`/api/payment/${inst.id}/start`} method="post" className="flex-1">
              <Button type="submit" variant="secondary" className="w-full">
                Proceed to Pay
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
