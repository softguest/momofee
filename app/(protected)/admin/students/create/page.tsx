import CreateStudentForm from "./CreateStudentForm";

export default function NewStudentPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Create New Student
      </h1>
      <CreateStudentForm />
    </div>
  );
}
