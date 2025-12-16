import NewInstallmentForm from "./installment-form";

export default function NewInstallmentPage({ params }: { params: { id: string; feeId: string } }) {
  return <NewInstallmentForm classId={params.id} feeId={params.feeId} />;
}
