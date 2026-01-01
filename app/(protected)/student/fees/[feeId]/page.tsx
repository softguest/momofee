import FeeDetail from "./FeeDetail";
export default async function ClassPage({
  params,
}: {
  params: Promise<{ feeId: string }>;
}) {
  const { feeId } = await params;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <FeeDetail feeId={feeId} />
    </div>
  );
}
