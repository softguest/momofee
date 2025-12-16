"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Installment = {
  id: string;
  name: string;
  amount: number;
  dueDate: Date | null;
};


type EditInstallmentFormProps = {
  inst: Installment;
  params: {
    id: string;
    feeId: string;
  };
};

export default function EditInstallmentForm({
  inst,
  params,
}: EditInstallmentFormProps) {
  const router = useRouter();
  const { id: classId, feeId } = params;

  const [form, setForm] = useState({
  name: inst.name,
  amount: inst.amount,
  dueDate: inst.dueDate
    ? inst.dueDate.toISOString().split("T")[0]
    : "",
});


  async function handleSubmit() {
    await fetch(
      `/api/admin/classes/${classId}/fees/${feeId}/installments/${inst.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    router.push(
      `/admin/classes/${classId}/fees/${feeId}/installments`
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Installment</h1>

      <Input
        placeholder="Installment Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: Number(e.target.value) })
        }
      />

      <Input
        placeholder="Due Date"
        type="date"
        value={form.dueDate}
        onChange={(e) =>
          setForm({ ...form, dueDate: e.target.value })
        }
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save Changes
      </Button>
    </div>
  );
}
