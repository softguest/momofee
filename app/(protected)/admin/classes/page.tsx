import { db } from "@/config/db";
import { classes, students } from "@/config/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ClassesPage() {
  const rows = await db.execute(sql`
    SELECT
      c.id,
      c.name,
      c.description,
      c.created_at,
      COUNT(s.id)::int AS student_count
    FROM classes c
    LEFT JOIN students s ON s.class_id = c.id
    GROUP BY c.id
    ORDER BY c.name ASC
  `);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Classes</h1>

        <Button asChild>
          <Link href="/admin/classes/new">Create Class</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {rows.rows.length === 0 && (
            <p className="text-muted-foreground text-xs">No classes found.</p>
          )}

          {rows.rows.map((c: any) => (
            <div
              key={c.id}
              className="border-b border-border pb-3 last:border-none flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                {c.description && (
                  <p className="text-xs text-muted-foreground">
                    {c.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {c.student_count} students
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/classes/${c.id}/edit`}>Edit</Link>
                </Button>

                <Button asChild variant="default" size="sm">
                  <Link href={`/admin/classes/${c.id}/delete`}>Delete</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
