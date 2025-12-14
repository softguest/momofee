"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";

export default function EditFeePage() {
  const router = useRouter();
  const params = useParams();
  const feeId = params.feeId as string;

  const [form, setForm] = useState({
    academicYear: "",
    term: "",
    totalAmount: "",
    description: "",
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/fees/${feeId}`);
      const data = await res.json();
      setForm({
        academicYear: data.academicYear,
        term: data.term,
        totalAmount: data.totalAmount,
        description: data.description || "",
      });
    }
    load();
  }, [feeId]);

  async function handleSubmit() {
    await fetch(`/api/admin/fees/${feeId}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    router.push("/admin/fees");
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Fee</h1>

      <Input
        placeholder="Academic Year"
        value={form.academicYear}
        onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
      />

      <Input
        placeholder="Term"
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
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save Changes
      </Button>
    </div>
  );
}
