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
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th>Academic Year</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-t">
                <td className="p-2 font-medium">{cls.name}</td>
                <td>{cls.academicYear}</td>
                <td className="text-gray-600">
                  {cls.description || "—"}
                </td>
                <td className="text-right pr-3">
                  <Link
                    href={`/admin/classes/${cls.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
