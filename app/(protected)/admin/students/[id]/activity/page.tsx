import { db } from "@/config/db";
import {
  students,
  fees,
  payments,
  studentNotes,
  parentsStudents,
  users,
} from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function StudentActivityPage({
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

  // Fees activity
  const feeEvents = await db.execute(sql`
    SELECT
      id,
      created_at AS at,
      'fee_created' AS type,
      academic_year,
      term
    FROM fees
    WHERE student_id = ${studentId}
  `);

  // Payments activity
  const paymentEvents = await db.execute(sql`
    SELECT
      id,
      created_at AS at,
      'payment' AS type,
      amount,
      status
    FROM payments
    WHERE student_id = ${studentId}
  `);

  // Notes activity
  const notesEvents = await db.execute(sql`
    SELECT
      n.id,
      n.created_at AS at,
      'note' AS type,
      n.content,
      u.email AS author_email
    FROM student_notes n
    JOIN users u ON u.id = n.author_user_id
    WHERE n.student_id = ${studentId}
  `);

  // Parent link events
  const parentLinks = await db.execute(sql`
    SELECT
      ps.id,
      ps.created_at AS at,
      'parent_linked' AS type,
      u.email AS parent_email
    FROM parents_students ps
    JOIN users u ON u.id = ps.parent_user_id
    WHERE ps.student_id = ${studentId}
  `);

  const events = [
    ...feeEvents.rows,
    ...paymentEvents.rows,
    ...notesEvents.rows,
    ...parentLinks.rows,
  ].sort(
    (a: any, b: any) =>
      new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-xl font-semibold">
        Activity — {student.firstName} {student.lastName}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {events.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No activity recorded yet.
            </p>
          )}

          {events.map((e: any) => (
            <div
              key={`${e.type}-${e.id}`}
              className="border-l border-border pl-3 relative pb-3 last:pb-0"
            >
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-accent" />
              <p className="text-xs text-muted-foreground">
                {new Date(e.at).toLocaleString()}
              </p>
              <EventDescription event={e} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EventDescription({ event }: { event: any }) {
  switch (event.type) {
    case "fee_created":
      return (
        <p className="text-sm">
          Fee created for <strong>{event.academic_year}</strong> —{" "}
          <strong>{event.term}</strong>.
        </p>
      );
    case "payment":
      return (
        <p className="text-sm">
          Payment of{" "}
          <strong>{Number(event.amount).toLocaleString()} XAF</strong>{" "}
          ({event.status}).
        </p>
      );
    case "note":
      return (
        <p className="text-sm">
          Note added by <strong>{event.author_email}</strong>:{" "}
          <span className="italic">{event.content}</span>
        </p>
      );
    case "parent_linked":
      return (
        <p className="text-sm">
          Parent <strong>{event.parent_email}</strong> linked.
        </p>
      );
    default:
      return <p className="text-sm">Activity recorded.</p>;
  }
}
