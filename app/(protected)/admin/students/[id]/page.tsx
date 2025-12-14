// // app/admin/students/[id]/page.tsx
// import { db } from "@/config/db";
// import { students } from "@/config/schema";
// import { eq } from "drizzle-orm";
// import { notFound } from "next/navigation";

// interface Props {
//   params: { id: string };
// }

// export default async function EditStudentPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const student = await db
//     .select()
//     .from(students)
//     .where(eq(students.id, id))
//     .then((r) => r[0]);

//   if (!student) return notFound();

//   return (
//     <div className="max-w-xl mx-auto py-10">
//       <h1 className="text-xl font-semibold mb-4">
//         Edit Student
//       </h1>

//     </div>
//   );
// }


import { db } from "@/config/db";
import {
  students,
  parentsStudents,
  users,
  fees,
  installments,
  payments,
} from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  // ✅ Fetch student
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);

  if (!student) return notFound();

  // ✅ Fetch linked parents
  const parentRows = await db
    .select({
      id: users.id,
      email: users.email,
      phone: users.phone,
    })
    .from(parentsStudents)
    .innerJoin(users, eq(parentsStudents.parentUserId, users.id))
    .where(eq(parentsStudents.studentId, id));

  // ✅ Fetch fees for this student
  const feeRows = await db
    .select()
    .from(fees)
    .where(eq(fees.studentId, id));

  // ✅ Fetch installments + payment status
  const installmentsData = await db.execute(sql`
    SELECT
      i.id,
      i.name,
      i.amount,
      i.due_date,
      COALESCE(SUM(p.amount), 0)::numeric AS paid_amount,
      CASE
        WHEN COALESCE(SUM(p.amount), 0) >= i.amount THEN 'paid'
        WHEN i.due_date < NOW() THEN 'overdue'
        ELSE 'pending'
      END AS status
    FROM installments i
    LEFT JOIN payments p ON p.installment_id = i.id AND p.status = 'success'
    WHERE i.fee_id IN (SELECT id FROM fees WHERE student_id = ${id})
    GROUP BY i.id
    ORDER BY i.due_date ASC NULLS LAST
  `);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      {/* ✅ Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {student.firstName} {student.lastName}
        </h1>

        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link href={`/admin/students/${student.id}/edit`}>Edit</Link>
          </Button>

          <Button asChild variant="default">
            <Link href={`/admin/students/${student.id}/delete`}>Delete</Link>
          </Button>
        </div>
      </div>

      {/* ✅ Student Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Full Name:</span>{" "}
            {student.firstName} {student.lastName}
          </p>
          <p>
            <span className="text-muted-foreground">Class:</span>{" "}
            {student.className}
          </p>
          <p>
            <span className="text-muted-foreground">Student Code:</span>{" "}
            {student.studentCode}
          </p>
        </CardContent>
      </Card>

      {/* ✅ Linked Parents */}
      <Card>
        <CardHeader>
          <CardTitle>Linked Parents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {parentRows.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No parents linked to this student.
            </p>
          )}

          {parentRows.map((p) => (
            <div
              key={p.id}
              className="border-b border-border pb-2 last:border-none"
            >
              <p className="font-medium">{p.email}</p>
              <p className="text-xs text-muted-foreground">{p.phone}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ✅ Fees */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Fees</CardTitle>
          <Button asChild size="sm">
            <Link href={`/admin/fees/new?studentId=${student.id}`}>
              Create Fee
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {feeRows.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No fees assigned to this student.
            </p>
          )}

          {feeRows.map((f) => (
            <div
              key={f.id}
              className="border-b border-border pb-3 last:border-none"
            >
              <p className="font-medium">
                {f.academicYear} — {f.term}
              </p>
              <p className="text-xs text-muted-foreground">
                Total: {Number(f.totalAmount).toLocaleString()} XAF
              </p>

              <Button
                asChild
                variant="secondary"
                size="sm"
                className="mt-2"
              >
                <Link href={`/admin/fees/${f.id}/installments`}>
                  Manage Installments
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ✅ Installments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Installments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {installmentsData.rows.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No installments found.
            </p>
          )}

          {installmentsData.rows.map((inst: any) => (
            <div
              key={inst.id}
              className="border-b border-border pb-3 last:border-none"
            >
              <p className="font-medium">{inst.name}</p>

              <p className="text-xs">
                Amount: {Number(inst.amount).toLocaleString()} XAF
              </p>

              {inst.due_date && (
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(inst.due_date).toLocaleDateString()}
                </p>
              )}

              <p
                className={
                  inst.status === "paid"
                    ? "text-[color:var(--color-success,#22C55E)] text-xs font-medium"
                    : inst.status === "overdue"
                    ? "text-destructive text-xs font-medium"
                    : "text-warning text-xs font-medium"
                }
              >
                Status: {inst.status}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
