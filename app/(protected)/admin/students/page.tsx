// ...existing imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { students } from "@/config/schema";
import { desc, sql } from "drizzle-orm";
import StudentsTable from "./students-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/config/db";

interface Props {
  searchParams: { q?: string; page?: string; class?: string };
}

const PAGE_SIZE = 10;

export default async function StudentsListPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() || "";
  const selectedClass = searchParams.class?.trim() || "";
  const page = Number(searchParams.page || "1") || 1;
  const offset = (page - 1) * PAGE_SIZE;

  // distinct classes for filter
  const classRows = await db.execute(sql`
    SELECT DISTINCT class_id FROM students ORDER BY class_id
  `);
  const classOptions = classRows.rows.map((r: any) => r.class_id as string);

  let whereClause = sql`true`;
  if (q) {
    whereClause = sql`${whereClause} AND (
      ${students.firstName} ILIKE ${"%" + q + "%"} OR
      ${students.lastName} ILIKE ${"%" + q + "%"} OR
      ${students.classId} ILIKE ${"%" + q + "%"} OR
      ${students.studentCode} ILIKE ${"%" + q + "%"}
    )`;
  }
  if (selectedClass) {
    whereClause = sql`${whereClause} AND ${students.classId} = ${selectedClass}`;
  }

  const rows = await db
    .select()
    .from(students)
    .where(whereClause)
    .orderBy(desc(students.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  const totalCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(students)
    .where(whereClause);

  const totalPages = Math.max(
    1,
    Math.ceil((totalCount[0].count ?? 0) / PAGE_SIZE)
  );

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/students/new">Add Student</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/students/import">Import CSV</Link>
          </Button>
        </div>
      </div>

      {/* Quick stat */}
      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {totalCount[0].count ?? 0} students
        {selectedClass ? ` in ${selectedClass}` : ""}.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentsTable
            students={rows}
            currentPage={page}
            totalPages={totalPages}
            currentQuery={q}
            currentClass={selectedClass}
            classOptions={classOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
