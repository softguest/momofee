"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Installment {
  id: string;
  name: string;
}

interface DeleteInstallmentConfirmProps {
  inst: Installment;
  params: {
    id: string;
    feeId: string;
  };
  hasPayments: boolean;
}

export default function DeleteInstallmentConfirm({
  inst,
  params,
  hasPayments,
}: DeleteInstallmentConfirmProps) {
  const router = useRouter();
  const { id: classId, feeId } = params;

  async function handleDelete() {
    await fetch(`/api/admin/classes/${classId}/fees/${feeId}/installments/${inst.id}`, {
      method: "DELETE",
    });

    router.push(`/admin/classes/${classId}/fees/${feeId}/installments`);
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold text-destructive">
        Delete Installment
      </h1>

      <p className="text-sm">
        Are you sure you want to delete <strong>{inst.name}</strong>?
      </p>

      {hasPayments && (
        <p className="text-xs text-destructive">
          This installment has payments. You cannot delete it.
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            router.push(`/admin/classes/${classId}/fees/${feeId}/installments`)
          }
        >
          Cancel
        </Button>

        <Button
          variant="default"
          className="flex-1"
          disabled={hasPayments}
          onClick={handleDelete}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  );
}

