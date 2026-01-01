// import Link from "next/link";
// import { FiUser, FiBook, FiCreditCard, FiClock } from "react-icons/fi";

// export default async function StudentPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   return (
//     <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
//       <div className="px-6">
//         <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
//           Student Details
//         </h2>

//         <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {id}
//         </div>
//       </div>
//     </section>
//   );
// };

import { db } from "@/config/db";
import { students, users, classes } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";
import { FiUser } from "react-icons/fi";

export default async function StudentPage({
  params,
}: {
   params: Promise<{ id: string }>;
}) {
  const {id} = await params;

  const [student] = await db
    .select({
      id: students.id,
      studentCode: students.studentCode,
      firstName: students.firstName,
      lastName: students.lastName,
      gender: students.gender,
      createdAt: students.createdAt,
      className: classes.name,
      academicYear: classes.academicYear,
      email: users.email,
      role: users.role,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(
      and(
        eq(students.id, id),
        isNull(students.deletedAt),
        isNull(users.deletedAt)
      )
    )
    .limit(1);

  if (!student) return <p>Student not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6"><div>Student Details</div> <div><FiUser /></div></div>
      <section className="px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            <span>Student: </span>{student.firstName} {student.lastName}
          </h2>

          <div className="mt-12">
            <span>Student Code: </span> <span className="ml-4 bg-accent/20 p-4 rounded-sm">{student.studentCode}</span>
          </div>
        </div>
      </section>
      <div className="px-4 py-10 py-12">
        <h1 className="text-2xl font-bold">
          {student.firstName} {student.lastName}
        </h1>
        <p>{student.className} – {student.academicYear}</p>
        <p>{student.email}</p>
      </div>
    </div>
  );
}
