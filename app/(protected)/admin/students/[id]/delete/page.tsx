import { db } from "@/config/db";
import { students, parentsStudents, fees } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import DeleteStudentConfirm from "./delete-student-confirm";

interface Props {
  params: { id: string };
}

export default async function DeleteStudentPage({
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

  // Check if linked to parent or fees
  const linkedParents = await db
    .select()
    .from(parentsStudents)
    .where(eq(parentsStudents.studentId, student.id));

  const linkedFees = await db
    .select()
    .from(fees)
    .where(eq(fees.studentId, student.id));

  const hasDependencies =
    linkedParents.length > 0 || linkedFees.length > 0;

  return (
    <DeleteStudentConfirm
      student={student}
      hasDependencies={hasDependencies}
    />
  );
}
