"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveTableRow,
  ResponsiveCell,
} from "@/components/ui/ResponsiveTable";
import WaterLoader from "@/components/loaders/WaterLoader";
import { FiArrowLeft, FiPlayCircle } from "react-icons/fi";

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
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <WaterLoader label="Loading Your Class..." />;

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>

        <Link
          href="/admin/students/create"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + New Student
        </Link>
      </div> */}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">Students <FiPlayCircle/></h1>

        <Link
          href="/dashboard"
          className="bg-primary flex items-center gap-2 text-white px-4 py-2 rounded"
        >
          <FiArrowLeft /> Back Home
        </Link>
      </div>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md mb-8">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            List Of Students
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="border rounded p-6 text-center text-gray-500">
          No students created yet.
        </div>
      )}

      {/* Students Table */}
      {students.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            {/* Desktop header */}
            <thead className="hidden md:table-header-group bg-gray-100">
              <tr>
                <th className="p-3 text-left">Student Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <ResponsiveTableRow key={s.id}>
                  <ResponsiveCell label="Student Code">
                    <span className="font-medium">{s.studentCode}</span>
                  </ResponsiveCell>

                  <ResponsiveCell label="Name">
                    <span className="font-medium">
                      {s.firstName} {s.middleName} {s.lastName}
                    </span>
                  </ResponsiveCell>

                  <ResponsiveCell label="Class">
                    {s.class?.name || "—"}
                  </ResponsiveCell>

                  <ResponsiveCell label="Academic Year">
                    {s.class?.academicYear || "—"}
                  </ResponsiveCell>

                  <ResponsiveCell label="Created At">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </ResponsiveCell>

                  <ResponsiveCell label="Action" align="right">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-blue-600 cursor-pointer font-medium"
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
