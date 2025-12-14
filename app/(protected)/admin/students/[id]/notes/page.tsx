import { db } from "@/config/db";
import { students, studentNotes, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NotesList from "./notes-list";

export default async function StudentNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clerkUser = await currentUser();
  if (!clerkUser) return notFound();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);

  if (!student) return notFound();

  const notes = await db
    .select({
      id: studentNotes.id,
      content: studentNotes.content,
      createdAt: studentNotes.createdAt,
      authorEmail: users.email,
    })
    .from(studentNotes)
    .innerJoin(users, eq(studentNotes.authorUserId, users.id))
    .where(eq(studentNotes.studentId, id));

      // ✅ Serialize Date → string for client component
    const serializedNotes = notes.map((n) => ({
        id: n.id,
        content: n.content,
        createdAt: n.createdAt ? n.createdAt.toISOString() : "",
        authorEmail: n.authorEmail,
    }));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-xl font-semibold">
        Notes — {student.firstName} {student.lastName}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Internal Notes</CardTitle>
        </CardHeader>
        <CardContent>
        <NotesList
            studentId={id}
            initialNotes={serializedNotes}
            // clerkUserId={clerkUser.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
