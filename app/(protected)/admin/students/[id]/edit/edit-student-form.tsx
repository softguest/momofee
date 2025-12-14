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
    className: string;
    studentCode: string;
  };
}

export default function EditStudentForm({ student }: EditStudentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    className: student.className,
    studentCode: student.studentCode,
  });

  async function handleSubmit() {
    await fetch(`/api/admin/students/${student.id}`, {
      method: "PUT",
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
        Save Changes
      </Button>
    </div>
  );
}
