import { db } from "@/config/db";
import { classFees } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditClassFeeForm from "./edit-form";

export default async function EditClassFeePage({
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

  return <EditClassFeeForm classId={id} fee={fee} />;
}
