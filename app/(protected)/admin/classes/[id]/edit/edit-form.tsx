"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditClassForm({
  cls,
}: {
  cls: {
    id: string;
    name: string;
    description: string | null;
  };
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: cls.name,
    description: cls.description ?? "",
  });

  async function handleSubmit() {
    await fetch(`/api/admin/classes/${cls.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    router.push("/admin/classes");
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Class</h1>

      <Input
        placeholder="Class Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Textarea
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
