"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function AddStudentPage() {
  const { classId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/classes/${classId}/students`, {
      method: "POST",
      body: JSON.stringify({
        studentClerkId: formData.get("studentClerkId"),
        studentCode: formData.get("studentCode"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    alert("Student added to class successfully!");
    e.currentTarget.reset();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Student to Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="studentClerkId"
          placeholder="Student Clerk ID"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="studentCode"
          placeholder="Optional Student Code"
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
