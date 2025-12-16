import { db } from "@/config/db";
import { classes, classFees } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ClassFeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [cls] = await db
    .select()
    .from(classes)
    .where(eq(classes.id, id))
    .limit(1);

  if (!cls) return notFound();

  const fees = await db
    .select()
    .from(classFees)
    .where(eq(classFees.classId, id));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Fees — {cls.name}
        </h1>

        <Button asChild>
          <Link href={`/admin/classes/${id}/fees/new`}>
            Create Fee
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Fees</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {fees.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No fees created for this class yet.
            </p>
          )}

          {fees.map((f) => (
            <div
              key={f.id}
              className="border-b border-border pb-3 last:border-none flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {f.academicYear} — {f.term}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Number(f.amount).toLocaleString()} XAF
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/classes/${id}/fees/${f.id}/edit`}>
                    Edit
                  </Link>
                </Button>

                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/classes/${id}/fees/${f.id}/installments`}>
                    Installments
                  </Link>
                </Button>

                <Button asChild variant="default" size="sm">
                  <Link href={`/admin/classes/${id}/fees/${f.id}/delete`}>
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
