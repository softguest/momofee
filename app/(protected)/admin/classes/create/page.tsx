"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClassPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // initialize router

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        academicYear: formData.get("academicYear"),
        description: formData.get("description"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // Redirect to /admin/classes after successful creation
    router.push("/admin/classes");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Class name (e.g. Form 3A)"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="academicYear"
          placeholder="Academic year (e.g. 2024/2025)"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Optional description"
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Class"}
        </button>
      </form>
    </div>
  );
}
