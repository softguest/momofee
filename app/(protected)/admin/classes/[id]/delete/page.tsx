import { db } from "@/config/db";
import { classes, students } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import DeleteClassConfirm from "./delete-confirm";
// import DeleteClassConfirm from "./delete-confirm";

export default async function DeleteClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [cls] = await db
    .select()
    .from(classes)
    .where(eq(classes.id, id))
    .limit(1);

  if (!cls) return notFound();

  const studentCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(students)
    .where(eq(students.classId, cls.id));

  return (
    <DeleteClassConfirm
      cls={cls}
      hasStudents={studentCount[0].count > 0}
    />
  );
}
