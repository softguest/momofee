import NewClassFeeForm from "./fee-form";

export default function NewClassFeePage({
  params,
}: {
  params: { id: string };
}) {
  return <NewClassFeeForm classId={params.id} />;
}
