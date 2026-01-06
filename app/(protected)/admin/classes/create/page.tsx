"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WaterLoader from "@/components/loaders/WaterLoader";
import { FiPlus, FiPlusCircle } from "react-icons/fi";

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

  if (loading) return <WaterLoader label="Loading Class Form..." />;

  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className="flex items-center text-2xl font-bold mb-4 gap-x-2">Class Form<FiPlusCircle /></h1>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">Create a new class</h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
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
