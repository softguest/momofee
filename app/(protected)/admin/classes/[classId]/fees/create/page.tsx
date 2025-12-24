"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function CreateFeePage() {
  const { classId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/classes/${classId}/fees`, {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        amount: Number(formData.get("amount")),
        term: formData.get("term"),
        description: formData.get("description"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    alert("Fee created successfully!");
    e.currentTarget.reset();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Fee</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Fee name (e.g. Tuition)"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="term"
          placeholder="Term (e.g. Term 1)"
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
          {loading ? "Creating..." : "Create Fee"}
        </button>
      </form>
    </div>
  );
}
