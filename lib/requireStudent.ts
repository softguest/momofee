import { db }from "@/config/db"
import {students} from "@/config/schema"
import {eq} from "drizzle-orm"
// lib/requireStudent.ts
export async function requireStudent(userId: string) {
  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!student) {
    throw new Error("Student profile required");
  }

  return student;
}
