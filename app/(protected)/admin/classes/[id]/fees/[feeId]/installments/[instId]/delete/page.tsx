import { db } from "@/config/db";
import { classFeeInstallments, payments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import DeleteInstallmentConfirm from "./delete-confirm";

export default async function DeleteInstallmentPage({
  params,
}: {
  params: Promise<{ id: string; feeId: string }>; // expect feeId too
}) {
  const { id, feeId } = await params; // now resolved

  const [inst] = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.id, id))
    .limit(1);

  if (!inst) return notFound();

  const paymentsExist = await db
    .select()
    .from(payments)
    .where(eq(payments.installmentId, id));

  return (
    <DeleteInstallmentConfirm
      inst={inst}
      params={{ id, feeId }} // ✅ now matches DeleteInstallmentConfirmProps
      hasPayments={paymentsExist.length > 0}
    />
  );
}

