"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ClassDetailType = {
  id: string;
  name: string;
  description?: string;
  academicYear: string;
  createdAt: string;
};

export default function ClassDetail({ classId }: { classId: string }) {
  const [data, setData] = useState<ClassDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/admin/classes/${classId}`);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load class");
        }

        const result = await res.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [classId]);

  if (loading) return <p>Loading class details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-6">

      {/* -------- CLASS INFO -------- */}
      <div className="border rounded p-4">
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <p className="text-sm text-gray-500 mt-1">
          Academic Year: <b>{data.academicYear}</b>
        </p>

        {data.description && (
          <p className="mt-3 text-gray-700">{data.description}</p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Created on {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* -------- PLACEHOLDER (Fees, Students, etc.) -------- */}
      <div className="border rounded p-4 bg-muted">
        <p className="text-sm text-muted-foreground">
          Fee structure, students, and payments will appear here.
        </p>
      </div>

      <Button variant="outline">Edit Class</Button>
    </div>
  );
}
