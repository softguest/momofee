"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type StudentClass = { id: string; name: string };

export default function NewStudentForm({ classes }: { classes: StudentClass[] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    classId: classes.length > 0 ? classes[0].id : "",
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

      {/* ✅ Class Dropdown */}
      <select
        className="border border-border rounded-md bg-background px-3 py-2 text-sm w-full"
        value={form.classId}
        onChange={(e) => setForm({ ...form, classId: e.target.value })}
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

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
