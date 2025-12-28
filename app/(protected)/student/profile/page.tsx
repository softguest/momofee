"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Class = {
  id: string;
  name: string;
};

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  // 🔹 Fetch classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/student/class");
        if (!res.ok) throw new Error("Failed to fetch classes");

        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setClassesLoading(false);
      }
    }

    fetchClasses();
  }, []);

  // 🔹 Submit profile
  async function submit(formData: FormData) {
    setLoading(true);

    const res = await fetch("/api/student/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId: formData.get("classId"),
      }),
    });

    if (res.ok) {
      router.push("/student/dashboard");
    }

    setLoading(false);
  }

  return (
    <form action={submit} className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Complete Student Profile</h1>

      <select
        name="classId"
        required
        disabled={classesLoading}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">
          {classesLoading ? "Loading classes..." : "Select Class"}
        </option>

        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      <button
        disabled={loading || classesLoading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Saving..." : "Create Profile"}
      </button>
    </form>
  );
}
