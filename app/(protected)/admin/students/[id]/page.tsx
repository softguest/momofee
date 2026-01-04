import { db } from "@/config/db";
import { students, users, classes, classFees, payments } from "@/config/schema";
import { eq, and, isNull } from "drizzle-orm";
import { FiUser, FiCreditCard } from "react-icons/fi";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* -------- FETCH STUDENT DETAILS -------- */
  const [student] = await db
    .select({
      id: students.id,
      studentCode: students.studentCode,
      firstName: students.firstName,
      middleName: students.middleName,
      lastName: students.lastName,
      gender: students.gender,
      age: students.age,
      createdAt: students.createdAt,
      className: classes.name,
      academicYear: classes.academicYear,
      email: users.email,
      role: users.role,
      classId: students.classId,
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

  /* -------- FETCH FEES FOR STUDENT'S CLASS -------- */
  const classFeesList = await db
    .select({
      id: classFees.id,
      title: classFees.name,
      amount: classFees.totalAmount
    })
    .from(classFees)
    .where(
      and(
        eq(classFees.classId, student.classId),
        isNull(classFees.deletedAt)
      )
    );

  /* -------- FETCH PAYMENTS MADE BY STUDENT -------- */
  const studentPayments = await db
    .select({
      feeId: payments.classFeeId,
      amountPaid: payments.amount,
      status: payments.status,
    })
    .from(payments)
    .where(
      and(
        eq(payments.studentId, student.id),
        eq(payments.status, "success")
      )
    );

  /* -------- CALCULATE FEE SUMMARY -------- */
  let totalFee = 0;
  let totalPaid = 0;

  classFeesList.forEach((f) => {
    totalFee += f.amount ?? 0;
    const paidForFee = studentPayments
      .filter((p) => p.feeId === f.id)
      .reduce((sum, p) => sum + (p.amountPaid ?? 0), 0);
    totalPaid += paidForFee;
  });

  const balance = totalFee - totalPaid;

  /* -------- RENDER -------- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* -------- STUDENT HEADER -------- */}
      <div className="flex items-center space-x-2 text-2xl font-semibold">
        <div>Student Details</div> <FiUser />
      </div>

      <section className="px-6 py-10 bg-primary text-white rounded-md">
        <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
          {student.firstName} {student.middleName} {student.lastName}
        </h2>
        <p className="mt-4 text-center">
          {student.className} – {student.academicYear}
        </p>
        <p className="text-center mt-2">{student.email}</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* -------- STUDENT INFO -------- */}
        <div className="px-4 py-6 border rounded shadow-sm space-y-2">
          <p>
            <span className="font-semibold">Student Code:</span>{" "}
            {student.studentCode}
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {student.gender}
          </p>
          <p>
            <span className="font-semibold">Age:</span> {student.age ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {student.role}
          </p>
          <div>
            {/* <span className="font-semibold">Joined:</span>{" "} */}
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {student.createdAt
                ? new Date(student.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
        {/* -------- FEE SUMMARY -------- */}
        <div className="px-4 py-6 border rounded shadow-sm space-y-2 bg-yellow-50">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <FiCreditCard /> <span className="mr-4">Fee Summary</span>
          </h3>
          <p>
            <span className="font-semibold">Total Fee:</span>{" "}
            {totalFee.toLocaleString()} XAF
          </p>
          <p>
            <span className="font-semibold">Paid:</span>{" "}
            {totalPaid.toLocaleString()} XAF
          </p>
          <p>
            <span className="font-semibold">Balance:</span>{" "}
            {balance.toLocaleString()} XAF
          </p>

          {/* Optional: show per-fee breakdown */}
          {classFeesList.length > 0 && (
            <div className="mt-4 space-y-1">
              {classFeesList.map((f) => {
                const paidForFee = studentPayments
                  .filter((p) => p.feeId === f.id)
                  .reduce((sum, p) => sum + (p.amountPaid ?? 0), 0);
                const feeBalance = (f.amount ?? 0) - paidForFee;
                return (
                  <div
                    key={f.id}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>{f.title}</span>
                    <span>
                      Paid: <span className="font-bold">{paidForFee.toLocaleString()}</span> XAF | Balance:{" "}
                      <span className="font-bold">{feeBalance.toLocaleString()}</span> XAF
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>  
    </div>
  );
}
