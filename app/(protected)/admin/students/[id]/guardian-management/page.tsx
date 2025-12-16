import { db } from "@/config/db";
import { students, parentsStudents, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GuardianManager from "./guardian-manager";

export default async function GuardianManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = id;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) return notFound();

  const links = await db
    .select({
      linkId: parentsStudents.id,
      parentId: users.id,
      email: users.email,
      phone: users.phone,
    })
    .from(parentsStudents)
    .innerJoin(users, eq(parentsStudents.parentUserId, users.id))
    .where(eq(parentsStudents.studentId, studentId));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-xl font-semibold">
        Guardians — {student.firstName} {student.lastName}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Linked Parents</CardTitle>
        </CardHeader>
        <CardContent>
          <GuardianManager studentId={studentId} initialLinks={links} />
        </CardContent>
      </Card>
    </div>
  );
}
