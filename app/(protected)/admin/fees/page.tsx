import { db } from "@/config/db";
import {classFees, students } from "@/config/schema";
import { sql, desc, ilike, or, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FeesTable from "./fees-table";

interface Props {
  searchParams: { q?: string; page?: string; class?: string };
}

const PAGE_SIZE = 10;

export default async function FeesListPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() || "";
  const selectedClass = searchParams.class?.trim() || "";
  const page = Number(searchParams.page || "1") || 1;
  const offset = (page - 1) * PAGE_SIZE;

  // Distinct classes from students who have fees
  const classRows = await db.execute(sql`
    SELECT DISTINCT s.class_id
    FROM fees f
    JOIN students s ON s.id = f.student_id
    ORDER BY s.class_id
  `);
  const classOptions = classRows.rows.map((r: any) => r.class_name as string);

  let whereClause = sql`true`;
  if (q) {
    whereClause = sql`${whereClause} AND (
      s.first_name ILIKE ${"%" + q + "%"} OR
      s.last_name ILIKE ${"%" + q + "%"} OR
      f.academic_year ILIKE ${"%" + q + "%"} OR
      f.term ILIKE ${"%" + q + "%"}
    )`;
  }
  if (selectedClass) {
    whereClause = sql`${whereClause} AND s.class_id = ${selectedClass}`;
  }

  const rows = await db.execute(sql`
    SELECT
      f.id,
      f.academic_year,
      f.term,
      f.total_amount,
      s.first_name,
      s.last_name,
      s.class_id
    FROM fees f
    JOIN students s ON s.id = f.student_id
    WHERE ${whereClause}
    ORDER BY f.created_at DESC
    LIMIT ${PAGE_SIZE}
    OFFSET ${offset}
  `);

  const countRows = await db.execute(sql`
    SELECT COUNT(*)::int AS count
    FROM fees f
    JOIN students s ON s.id = f.student_id
    WHERE ${whereClause}
  `);
  const totalCount = (countRows.rows[0] as any).count as number;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Fees</h1>
        <Button asChild>
          <Link href="/admin/fees/new">Create Fee</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {rows.rows.length} of {totalCount} fees
        {selectedClass ? ` for ${selectedClass}` : ""}.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <FeesTable
            fees={rows.rows as any[]}
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
