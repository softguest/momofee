import { db } from "@/config/db";
import { classFees, classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InstallmentsPageProps {
  params: {
    id: string;     // classId
    feeId: string;
  };
}

export default async function InstallmentsPage({ params }: InstallmentsPageProps) {
  const { id: classId, feeId } = params;

  const [fee] = await db
    .select()
    .from(classFees)
    .where(eq(classFees.id, feeId))
    .limit(1);

  if (!fee) return notFound();

  const installments = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.classFeeId, feeId));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Installments — {fee.name}
        </h1>

        <Button asChild>
          <Link href={`/admin/classes/${classId}/fees/${feeId}/installments/new`}>
            Create Installment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {installments.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No installments created yet.
            </p>
          )}

          {installments.map((inst) => (
            <div
              key={inst.id}
              className="border-b border-border pb-3 last:border-none flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{inst.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Number(inst.amount).toLocaleString()} XAF
                </p>
                {inst.dueDate && (
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(inst.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/classes/${classId}/fees/${feeId}/installments/${inst.id}/edit`}>
                    Edit
                  </Link>
                </Button>

                <Button asChild variant="default" size="sm">
                  <Link href={`/admin/classes/${classId}/fees/${feeId}/installments/${inst.id}/delete`}>
                    Delete
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
