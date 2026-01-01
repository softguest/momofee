import ClassDetail from "./ClassDetail";
export default async function StudentFeePage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  return (
    <div className="">
      <ClassDetail classId={classId} />
    </div>
  );
}
