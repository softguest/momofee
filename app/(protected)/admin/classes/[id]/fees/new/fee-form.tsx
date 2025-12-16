"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewClassFeeForm({ classId }: { classId: string }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    term: "",
    amount: "",
  });

  async function handleSubmit() {
    await fetch(`/api/admin/classes/${classId}/fees`, {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push(`/admin/classes/${classId}/fees`);
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Create Fee</h1>

      <Input
        placeholder="Fee Name (e.g. Tuition)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        placeholder="Academic Year (e.g. 2024/2025)"
        value={form.academicYear}
        onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
      />

      <Input
        placeholder="Term (e.g. First Term)"
        value={form.term}
        onChange={(e) => setForm({ ...form, term: e.target.value })}
      />

      <Input
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
