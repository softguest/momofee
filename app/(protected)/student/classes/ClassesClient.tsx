"use client";

import WaterLoader from "@/components/loaders/WaterLoader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
// import WaterLoader from "@/components/loaders/WaterLoader";


type StudentClass = {
  id: string;
  name: string;
  description: string | null;
  academicYear: string;
  createdAt: string;
};

export default function StudentClassClient() {
  const [cls, setCls] = useState<StudentClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/class")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load class");
        }
        return res.json();
      })
      .then((data) => {
        setCls(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <WaterLoader label="Loading Your Class..." />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!cls) return null;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div
        className="bg-white shadow hover:shadow-lg hover:scale-[1.02] transition rounded-lg p-6 opacity-0 animate-fade-in"
        style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">Class Name:</p>
          <p className="text-lg font-semibold text-gray-900">{cls.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Academic Year:</p>
          <p className="text-gray-800">{cls.academicYear}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Description:</p>
          <p className="text-gray-700">{cls.description || "—"}</p>
        </div>

        <div className="mt-6 text-right">
          <Link href="/student/fees">
            <Button className="px-4 py-2 bg-primary cursor-pointer hover:bg-blue-700 text-white text-sm rounded-md transition">
              View Fees
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
