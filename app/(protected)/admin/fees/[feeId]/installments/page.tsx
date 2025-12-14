"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";

type Installment = {
  name: string;
  amount: string;
  dueDate: string;
};

export default function AddInstallmentsPage() {
  const router = useRouter();
  const params = useParams();
  const feeId = params.feeId as string;

  const [installments, setInstallments] = useState<Installment[]>([
    { name: "", amount: "", dueDate: "" },
  ]);

  function addRow() {
    setInstallments([
      ...installments,
      { name: "", amount: "", dueDate: "" },
    ]);
  }

  function updateRow(
    index: number,
    field: keyof Installment,
    value: string
  ) {
    const updated = [...installments];
    updated[index][field] = value;
    setInstallments(updated);
  }

  async function handleSubmit() {
    await fetch(`/api/admin/fees/${feeId}/installments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installments }),
    });

    router.push("/admin/fees");
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold">Add Installments</h1>

      {installments.map((inst, i) => (
        <div key={i} className="border border-border rounded-lg p-4 space-y-3">
          <Input
            placeholder="Installment Name"
            value={inst.name}
            onChange={(e) => updateRow(i, "name", e.target.value)}
          />

          <Input
            placeholder="Amount"
            type="number"
            value={inst.amount}
            onChange={(e) => updateRow(i, "amount", e.target.value)}
          />

          <Input
            placeholder="Due Date"
            type="date"
            value={inst.dueDate}
            onChange={(e) => updateRow(i, "dueDate", e.target.value)}
          />
        </div>
      ))}

      <Button variant="secondary" onClick={addRow}>
        Add Another Installment
      </Button>

      <Button className="w-full" onClick={handleSubmit}>
        Save Installments
      </Button>
    </div>
  );
}
