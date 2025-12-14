"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    className: "",
    studentCode: "",
  });

  async function handleSubmit() {
    await fetch("/api/admin/students", {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push("/admin/students");
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Create Student</h1>

      <Input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />

      <Input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />

      <Input
        placeholder="Class Name"
        value={form.className}
        onChange={(e) => setForm({ ...form, className: e.target.value })}
      />

      <Input
        placeholder="Student Code"
        value={form.studentCode}
        onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
