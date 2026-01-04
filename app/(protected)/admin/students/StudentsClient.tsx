"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StudentItem = {
  id: string;
  studentCode: string;
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
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
          href="/admin/students/create"
          className="bg-primary text-white px-4 py-2 rounded"
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
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            {/* Desktop header */}
            <thead className="hidden md:table-header-group bg-gray-100">
              <tr>
                <th className="p-2 text-left">Student Code</th>
                <th className="p-2 text-left">Name / User ID</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">Academic Year</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-right">Options</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="
                    border-t
                    md:table-row
                    block
                    p-4
                    md:p-0
                    space-y-2
                    md:space-y-0
                  "
                >
                  {/* Student Code */}
                  <td className="block md:table-cell md:p-2">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Student Code
                    </span>
                    <p className="font-medium">{s.studentCode}</p>
                  </td>

                  {/* Name */}
                  <td className="block md:table-cell md:p-2">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Name
                    </span>
                    <p className="font-medium">
                      {s.firstName} {s.middleName} {s.lastName}
                    </p>
                  </td>

                  {/* Class */}
                  <td className="block md:table-cell md:p-2">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Class
                    </span>
                    <p className="font-medium">{s.class?.name || "—"}</p>
                  </td>

                  {/* Academic Year */}
                  <td className="block md:table-cell md:p-2">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Academic Year
                    </span>
                    <p className="font-medium">
                      {s.class?.academicYear || "—"}
                    </p>
                  </td>

                  {/* Created At */}
                  <td className="block md:table-cell md:p-2">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Created At
                    </span>
                    <p className="font-medium">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Options */}
                  <td className="block md:table-cell md:p-2 md:text-right">
                    <span className="md:hidden text-gray-500 font-semibold">
                      Options
                    </span>
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-blue-600 font-medium inline-block mt-1"
                    >
                      View →
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