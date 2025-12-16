"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ClassFee {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  amount: number;
}

interface EditClassFeeFormProps {
  classId: string;
  fee: ClassFee;
}

export default function EditClassFeeForm({
  classId,
  fee,
}: EditClassFeeFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: fee.name,
    academicYear: fee.academicYear,
    term: fee.term,
    amount: fee.amount,
  });

  async function handleSubmit() {
    await fetch(`/api/admin/classes/${classId}/fees/${fee.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    router.push(`/admin/classes/${classId}/fees`);
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Fee</h1>

      <Input
        placeholder="Fee Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        placeholder="Academic Year"
        value={form.academicYear}
        onChange={(e) =>
          setForm({ ...form, academicYear: e.target.value })
        }
      />

      <Input
        placeholder="Term"
        value={form.term}
        onChange={(e) =>
          setForm({ ...form, term: e.target.value })
        }
      />

      <Input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: Number(e.target.value) })
        }
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save Changes
      </Button>
    </div>
  );
}
