import { db } from "@/config/db";
import { classFees, classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import DeleteClassFeeConfirm from "./delete-confirm";

export default async function DeleteClassFeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [fee] = await db
    .select()
    .from(classFees)
    .where(eq(classFees.id, id))
    .limit(1);

  if (!fee) return notFound();

  const installments = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.classFeeId, fee.id));

  return (
    <DeleteClassFeeConfirm
      classId={id}
      fee={fee}
      hasInstallments={installments.length > 0}
    />
  );
}
