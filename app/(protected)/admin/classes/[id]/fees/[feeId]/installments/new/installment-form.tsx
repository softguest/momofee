"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NewInstallmentFormProps {
  classId: string;
  feeId: string;
}

export default function NewInstallmentForm({ classId, feeId }: NewInstallmentFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });

  async function handleSubmit() {
    await fetch(`/api/admin/classes/${classId}/fees/${feeId}/installments`, {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push(`/admin/classes/${classId}/fees/${feeId}/installments`);
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Create Installment</h1>

      <Input
        placeholder="Installment Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <Input
        placeholder="Due Date"
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
