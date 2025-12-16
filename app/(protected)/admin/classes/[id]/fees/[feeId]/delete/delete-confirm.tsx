"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import { classFees } from "@/config/schema";

type ClassFee = InferSelectModel<typeof classFees>;

interface DeleteClassFeeConfirmProps {
  classId: string;
  fee: ClassFee;
  hasInstallments: boolean;
}

export default function DeleteClassFeeConfirm({
  classId,
  fee,
  hasInstallments,
}: DeleteClassFeeConfirmProps) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/classes/${classId}/fees/${fee.id}`, {
      method: "DELETE",
    });

    router.push(`/admin/classes/${classId}/fees`);
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold text-destructive">
        Delete Fee
      </h1>

      <p className="text-sm">
        Are you sure you want to delete <strong>{fee.name}</strong>?
      </p>

      {hasInstallments && (
        <p className="text-xs text-destructive">
          This fee has installments. Delete them first.
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            router.push(`/admin/classes/${classId}/fees`)
          }
        >
          Cancel
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          disabled={hasInstallments}
          onClick={handleDelete}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  );
}
