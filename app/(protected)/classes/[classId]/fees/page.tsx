import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, students } from "@/config/schema";
import { eq } from "drizzle-orm";
import FeesTable from "./FeesTable";

export default async function ClassFeesPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
      // ✅ unwrap params
  const { classId } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  // Students can only view THEIR class
  if (user.role === "student") {
    const student = await db.query.students.findFirst({
      where: eq(students.userId, user.id),
    });

    if (!student || student.classId !== classId) {
      return <p>Access denied</p>;
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Class Fees</h1>

        {user.role === "admin" && (
          <a
            href={`/admin/classes/${classId}/fees/new`}
            className="text-sm bg-black cursor-pointer text-white px-4 py-2 rounded"
          >
            + Create Fee
          </a>
        )}
      </div>

      <FeesTable classId={classId} role={user.role} />
    </div>
  );
}
