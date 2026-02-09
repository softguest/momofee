"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  classId: string;
};

export default function CreateFeeForm({ classId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    term: "",
    description: "",
    academicYear: "",
    paymentType: "",
  });


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      `/api/admin/classes/${classId}/fees/new`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          term: form.term,
          description: form.description,
          academicYear: form.academicYear,
          paymentType: form.paymentType,
        }),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Failed to create fee");
      return;
    }

    router.push(`/admin/classes/${classId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Fee Name */}
      <div>
        <Label>Fee Name</Label>
        <Input
          placeholder="Tuition Fee"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Academic Year</Label>
        <Input
          placeholder="2024/2025"
          value={form.academicYear}
          onChange={(e) =>
            setForm({ ...form, academicYear: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label>Payment Type</Label>
        <Select
          onValueChange={(value) =>
            setForm({ ...form, paymentType: value })
          }
          
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FULL">Full Payment</SelectItem>
            <SelectItem value="INSTALLMENT">Installments</SelectItem>
          </SelectContent>
        </Select>
      </div>


      {/* Term */}
      <div>
        <Label>Term</Label>
        <Select
          onValueChange={(value) =>
            setForm({ ...form, term: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div>
        <Label>Total Amount (XAF)</Label>
        <Input
          type="number"
          placeholder="150000"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description (optional)</Label>
        <Textarea
          placeholder="Annual tuition fee for the academic year"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <Button disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Fee"}
      </Button>
    </form>
  );
}
