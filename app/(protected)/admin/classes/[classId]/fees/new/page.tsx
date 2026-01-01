// app/admin/classes/[classId]/fees/new/page.tsx

import CreateFeeForm from "./CreateFeeForm";

export default async function CreateFeePage(
  {params,}: {params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Create Fee for Class
      </h1>

      <CreateFeeForm classId={classId} />
    </div>
  );
}
