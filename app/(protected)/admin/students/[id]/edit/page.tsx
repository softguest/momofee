import { db } from "@/config/db";
import { students } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditStudentForm from "./edit-student-form";

interface Props {
  params: { id: string };
}

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

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Student</h1>
      <EditStudentForm student={student} />
    </div>
  );
}
