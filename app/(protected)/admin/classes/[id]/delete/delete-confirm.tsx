"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DeleteClassConfirmProps = {
  cls: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date | null;
  };
  hasStudents: boolean;
};

export default function DeleteClassConfirm({
  cls,
  hasStudents,
}: DeleteClassConfirmProps) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/classes/${cls.id}`, {
      method: "DELETE",
    });

    router.push("/admin/classes");
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold text-destructive">
        Delete Class
      </h1>

      <p className="text-sm">
        Are you sure you want to delete <strong>{cls.name}</strong>?
      </p>

      {hasStudents && (
        <p className="text-xs text-destructive">
          This class has students assigned. You must move or delete them first.
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/admin/classes")}
        >
          Cancel
        </Button>

        <Button
          variant="default"
          className="flex-1"
          disabled={hasStudents}
          onClick={handleDelete}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  );
}
