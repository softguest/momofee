import { db } from "@/config/db";
import { students, classes } from "@/config/schema"; // ✅ import classes
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditStudentForm from "./edit-student-form";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);

  if (!student) return notFound();

  const classRows = await db
    .select({
      id: classes.id,
      name: classes.name,
    })
    .from(classes)
    .orderBy(classes.name);

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Student</h1>
      <EditStudentForm student={student} classes={classRows} />
    </div>
  );
}
