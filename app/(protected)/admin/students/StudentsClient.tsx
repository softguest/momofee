"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StudentItem = {
  id: string;
  studentCode: string;
  userId: string;
  createdByAdminId: string;
  createdAt: string;
  class?: {
    id: string;
    name: string;
    academicYear: string;
  };
};

export default function StudentsClient() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 text-gray-500">
        Loading students...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>

        <Link
          href="/admin/students/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Student
        </Link>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="border rounded p-6 text-center text-gray-500">
          No students created yet.
        </div>
      )}

      {/* Students Table */}
      {students.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Student Code</th>
              <th>Name / User ID</th>
              <th>Class</th>
              <th>Academic Year</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2 font-medium">{s.studentCode}</td>
                <td>{s.userId}</td>
                <td>{s.class?.name || "—"}</td>
                <td>{s.class?.academicYear || "—"}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="text-right pr-3">
                  <Link
                    href={`/admin/students/${s.id}/fees`}
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
