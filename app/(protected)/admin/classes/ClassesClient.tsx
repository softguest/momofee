"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveTableRow,
  ResponsiveCell,
} from "@/components/ui/ResponsiveTable";
import WaterLoader from "@/components/loaders/WaterLoader";

type ClassItem = {
  id: string;
  name: string;
  description: string | null;
  academicYear: string;
  createdAt: string;
};

export default function ClassesClient() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <WaterLoader label="Loading Classes..." />;
  
  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Classes</h1>

        <Link
          href="/admin/classes/create"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + New Class
        </Link>
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className="border rounded p-6 text-center text-gray-500">
          No classes created yet.
        </div>
      )}

      {/* Classes Table */}
      {classes.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            {/* Desktop header */}
            <thead className="hidden md:table-header-group bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Academic Year</th>
                <th className="p-3 text-left font-semibold">Description</th>
                <th className="p-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <ResponsiveTableRow key={cls.id} className="hover:bg-gray-50">
                  <ResponsiveCell label="Name">
                    <span className="font-medium">{cls.name}</span>
                  </ResponsiveCell>

                  <ResponsiveCell label="Academic Year">
                    {cls.academicYear}
                  </ResponsiveCell>

                  <ResponsiveCell label="Description">
                    {cls.description || "—"}
                  </ResponsiveCell>

                  <ResponsiveCell label="Action" align="right">
                    <Link
                      href={`/admin/classes/${cls.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View →
                    </Link>
                  </ResponsiveCell>
                </ResponsiveTableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
