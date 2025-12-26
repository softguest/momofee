import StudentFees from "./StudentFees";

export default function ParentStudentFeesPage({
  params,
}: {
  params: { studentId: string };
}) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Child Fees
      </h1>
      <StudentFees studentId={params.studentId} role="parent" />
    </div>
  );
}
