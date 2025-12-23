// ...existing imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, students } from "@/config/schema"; 
import { eq, and, ilike, desc, sql, or } from "drizzle-orm";
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

  // Class filter options
  const classRows = await db.execute(
    sql`SELECT DISTINCT class_id FROM students ORDER BY class_id`
  );
  const classOptions = classRows.rows.map((r: any) => r.class_id as string);

  // WHERE clause
  let whereClause = and(eq(users.role, "student"));

  if (q) {
    whereClause = and(
      whereClause,
      or(
        // ilike(users.firstName, `%${q}%`),
        // ilike(users.lastName, `%${q}%`),
        ilike(students.classId, `%${q}%`),
        ilike(students.studentCode, `%${q}%`)
      )
    );
  }

  if (selectedClass) {
    whereClause = and(whereClause, eq(students.classId, selectedClass));
  }

  // Fetch students
  const rows = await db
    .select({
      id: users.id,
      // firstName: users.firstName,
      // lastName: users.lastName,
      email: users.email,
      classId: students.classId,
      studentCode: students.studentCode,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(students, eq(users.id, students.userId))
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  const totalCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .leftJoin(students, eq(users.id, students.userId))
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

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {totalCount[0].count ?? 0} students{" "}
        {selectedClass ? `in ${selectedClass}` : ""}.
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
