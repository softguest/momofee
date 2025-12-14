"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    className: string;
  };
  hasDependencies: boolean;
}

export default function DeleteStudentConfirm({
  student,
  hasDependencies,
}: Props) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/students");
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold text-destructive">
        Delete Student
      </h1>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-semibold">
          {student.firstName} {student.lastName}
        </span>{" "}
        ({student.className})?
      </p>

      {hasDependencies && (
        <p className="text-xs text-destructive">
          This student is linked to parents and/or fees. You may need to
          remove or reassign those first.
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/admin/students")}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleDelete}
          disabled={hasDependencies}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  );
}
