import { db } from "@/config/db";
import { classFeeInstallments } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditInstallmentForm from "./edit-form";

export default async function EditInstallmentPage({
  params,
}: {
  params: Promise<{ id: string; feeId: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [inst] = await db
    .select()
    .from(classFeeInstallments)
    .where(eq(classFeeInstallments.id, id))
    .limit(1);

  if (!inst) return notFound();

  return (
    <EditInstallmentForm
      inst={inst}
      params={resolvedParams}
    />
  );
}

