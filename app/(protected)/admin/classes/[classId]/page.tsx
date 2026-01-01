import ClassDetail from "./ClassDetail";
export default async function StudentFeePage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <ClassDetail classId={classId} />
    </div>
  );
}
