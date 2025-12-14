import { db } from "@/config/db";
import { classes } from "@/config/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditClassForm from "./edit-form";


export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cls = await db
    .select()
    .from(classes)
    .where(eq(classes.id, id))
    .limit(1);

  if (cls.length === 0) return notFound();

  return <EditClassForm cls={cls[0]} />;
}
