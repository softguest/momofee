"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateFeePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    studentId: "",
    academicYear: "",
    term: "",
    totalAmount: "",
    description: "",
  });

  async function handleSubmit() {
    const res = await fetch("/api/admin/fees", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const { feeId } = await res.json();
      router.push(`/admin/fees/${feeId}/installments`);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Create Fee</h1>

      <Input
        placeholder="Student ID"
        value={form.studentId}
        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
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
        placeholder="Total Amount"
        type="number"
        value={form.totalAmount}
        onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
      />

      <Input
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save & Continue
      </Button>
    </div>
  );
}
