import { PaymentProcessing } from "@/components/payment/payment-processing";

export default function ProcessingPage({ searchParams }: any) {
  const paymentId = searchParams.paymentId;

  return <PaymentProcessing paymentId={paymentId} />;
}
