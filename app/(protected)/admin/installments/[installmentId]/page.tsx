// import InstallmentDetails from "./InstallmentDetails";

import InstallmentDetails from "./IntsallmentDetails";

export default async function InstallmentDetailsPage({
  params,
}: {
  params: Promise<{ installmentId: string }>;
}) {
  const { installmentId } = await params;

  if (!installmentId) {
    return <p className="text-red-600">Invalid installment ID</p>;
  }

  return <InstallmentDetails installmentId={installmentId} />;
}
