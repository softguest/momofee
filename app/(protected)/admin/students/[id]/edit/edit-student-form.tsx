"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EditStudentFormProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    classId: string;
    studentCode: string;
  };
  classes: {
    id: string;
    name: string;
  }[];
}


export default function EditStudentForm({
  student,
  classes,
}: EditStudentFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    classId: student.classId,
    studentCode: student.studentCode,
  });

  async function handleSubmit() {
    await fetch(`/api/admin/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/students");
  }

  return (
    <div className="space-y-4">
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

      {/* ✅ Class dropdown */}
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
        Save Changes
      </Button>
    </div>
  );
}
