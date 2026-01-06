"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiLayers } from "react-icons/fi";
import WaterLoader from "@/components/loaders/WaterLoader";
import Link from "next/link";
import InstallmentModal from "./InstallmentModal"

type ClassType = {
  id: string;
  name: string;
  description?: string;
  academicYear: string;
  createdAt: string;
};

type FeeType = {
  id: string;
  name: string;
  totalAmount: number;
  paymentType?: "FULL" | "INSTALLMENT";
};


type StudentType = {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  gender: string;
};

type ClassDetailResponse = {
  class: ClassType;
  fees: FeeType[];
  students: StudentType[];
  stats: {
    totalStudents: number;
    totalFees: number;
  };
};

export default function ClassDetail({ classId }: { classId: string }) {
  const [data, setData] = useState<ClassDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);


  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/admin/classes/${classId}`);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load class");
        }

        const result: ClassDetailResponse = await res.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [classId]);

  if (loading) return <WaterLoader label="Loading class details..." />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const { class: cls, fees, students, stats } = data;

  return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          {/* -------- STUDENT HEADER -------- */}
          <div className="flex items-center space-x-2 text-2xl font-semibold">
            <div>Class Details</div> <FiLayers />
          </div>
    
          <section className="px-6 py-10 bg-primary text-white rounded-md">
            <div className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
              <h1 className="text-2xl font-semibold">{cls.name}</h1>
            </div>
            <p className="mt-4 text-center">
               Academic Year: <b>{cls.academicYear}</b>
            </p>
            <p className="text-center mt-2">
              {/* {student.email} */}
              </p>
          </section>

      {/* -------- CLASS INFO -------- */}
      <div className="border rounded p-4 shadow-sm">

        {cls.description && (
          <p className="mt-3 text-gray-700">{cls.description}</p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Created on {new Date(cls.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* -------- FEES -------- */}
      <div className="border rounded p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">
          Fee Structure ({stats.totalFees})
        </h2>
        {fees.length === 0 ? (
          <p className="text-gray-500">No fees assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {fees.map((fee) => (
              <li
                key={fee.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">{fee.name}</p>
                  <p className="text-sm text-gray-500">
                    {fee.totalAmount.toLocaleString()} XAF
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFeeId(fee.id)}
                >
                  Add Installment
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* -------- STUDENTS -------- */}
      <div className="border rounded p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">
          Students ({stats.totalStudents})
        </h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students in this class yet.</p>
        ) : (
          <ul className="space-y-2">
            {students.map((s) => (
              <li
                key={s.id}
                className="flex justify-between border p-2 rounded"
              >
                <span>
                  {s.studentCode} – {s.firstName} {s.lastName}
                </span>
                <span className="text-gray-500">{s.gender}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* -------- ACTION BUTTONS -------- */}
      <div className="flex space-x-2">
        <Link href="">
        <Button variant="outline">Edit Class</Button>
        </Link>
        <Link href="">
        <Button className="">Manage Students</Button>
        </Link>
        <Link href={`/admin/classes/${classId}/fees/new`}>
        <Button variant="secondary" className="">Create Fee</Button>
        </Link>
      </div>
      {selectedFeeId && (
        <InstallmentModal
          feeId={selectedFeeId}
          onClose={() => setSelectedFeeId(null)}
        />
      )}

    </div>
  );
}

