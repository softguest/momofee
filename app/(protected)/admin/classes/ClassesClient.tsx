"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <p className="text-gray-500">Loading classes...</p>
      </div>
    );
  }

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
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            {/* Desktop header only */}
            <thead className="hidden md:table-header-group bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Academic Year</th>
                <th className="p-3 text-left font-semibold">Description</th>
                <th className="p-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="
                    block md:table-row
                    p-3 md:p-0
                    hover:bg-gray-50 transition
                  "
                >
                  {/* Name */}
                  <td className="block md:table-cell p-2 md:p-3">
                    <span className="md:hidden text-xs font-semibold text-gray-500">
                      Name
                    </span>
                    <div className="font-medium">{cls.name}</div>
                  </td>

                  {/* Academic Year */}
                  <td className="block md:table-cell p-2 md:p-3">
                    <span className="md:hidden text-xs font-semibold text-gray-500">
                      Academic Year
                    </span>
                    <div>{cls.academicYear}</div>
                  </td>

                  {/* Description */}
                  <td className="block md:table-cell p-2 md:p-3 text-gray-600">
                    <span className="md:hidden text-xs font-semibold text-gray-500">
                      Description
                    </span>
                    <div>{cls.description || "—"}</div>
                  </td>

                  {/* Action */}
                  <td className="block md:table-cell p-2 md:p-3 md:text-right">
                    <Link
                      href={`/admin/classes/${cls.id}`}
                      className="inline-block text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>

      )}
    </div>
  );
}
