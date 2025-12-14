import { db } from "@/config/db";
import { students, fees } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StudentFeesPage({ params }: { params: { id: string } }) {
  const studentId = params.id;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) return notFound();

  const feeRows = await db
    .select()
    .from(fees)
    .where(eq(fees.studentId, studentId));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Fees — {student.firstName} {student.lastName}
        </h1>

        <Button asChild>
          <Link href={`/admin/fees/new?studentId=${student.id}`}>Create Fee</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {feeRows.length === 0 && (
            <p className="text-muted-foreground text-xs">No fees assigned.</p>
          )}

          {feeRows.map((f) => (
            <div key={f.id} className="border-b border-border pb-3 last:border-none">
              <p className="font-medium">
                {f.academicYear} — {f.term}
              </p>
              <p className="text-xs text-muted-foreground">
                Total: {Number(f.totalAmount).toLocaleString()} XAF
              </p>

              <div className="flex gap-3 mt-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/admin/fees/${f.id}/edit`}>Edit Fee</Link>
                </Button>

                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/fees/${f.id}/installments`}>Installments</Link>
                </Button>

                <Button asChild size="sm" variant="secondary">
                  <Link href={`/admin/fees/${f.id}/delete`}>Delete</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
