import { db } from "@/config/db";
import { classes } from "@/config/schema";
import NewStudentForm from "./student-form";

export default async function NewStudentPage() {
  const classRows = await db.select().from(classes).orderBy(classes.name);

  return <NewStudentForm classes={classRows} />;
}
