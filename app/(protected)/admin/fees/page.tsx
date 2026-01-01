"use client";
import React from "react";
import { useEffect, useState } from "react";

type Installment = {
  id: string;
  name: string;
  amount: number;
  dueDate: string | null;
  createdAt: string;
};

type ClassFee = {
  id: string;
  classId: string;
  name: string;
  academicYear: string;
  description?: string | null;
  term: string;
  totalAmount: number;
  paymentType: "FULL" | "INSTALLMENT";
  createdAt: string;
  installments: Installment[];
};

type ClassItem = {
  id: string;
  name: string;
  description?: string | null;
  academicYear: string;
  createdAt: string;
  fees: ClassFee[];
};

export default function ClassDetail() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/admin/class-fees");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load class fees");
        }
        const data = await res.json();
        setClasses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading classes...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (classes.length === 0) return <p className="p-6 text-gray-500">No classes found.</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Classes & Fees</h1>

      {classes.map((c) => (
        <div key={c.id} className="border rounded-lg p-5 space-y-4">
          {/* -------- CLASS INFO -------- */}
          <div className="mb-3">
            <h2 className="text-xl font-medium">{c.name}</h2>
            {c.description && <p className="text-gray-600">{c.description}</p>}
            <p className="text-sm text-gray-500">Academic Year: {c.academicYear}</p>
            <p className="text-sm text-gray-500">
              Created: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
            </p>
          </div>

          {/* -------- FEES -------- */}
          {c.fees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border mt-4 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Fee Name</th>
                    <th className="text-left">Term</th>
                    <th className="text-left">Academic Year</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {c.fees.map((f) => (
                    <React.Fragment key={f.id}>
                      <tr className="border-t">
                        <td className="p-2 font-medium">
                          {f.name}
                          {f.description && (
                            <div className="text-xs text-gray-500">{f.description}</div>
                          )}
                        </td>
                        <td>{f.term}</td>
                        <td>{f.academicYear}</td>
                        <td className="text-right">{f.totalAmount.toLocaleString()} XAF</td>
                        <td className="text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              f.paymentType === "FULL"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {f.paymentType}
                          </span>
                        </td>
                      </tr>

                      {/* -------- INSTALLMENTS -------- */}
                      {f.paymentType === "INSTALLMENT" && f.installments.length > 0 && (
                        <tr>
                          <td colSpan={5} className="p-2 bg-gray-50">
                            <div className="ml-4 space-y-1">
                              {f.installments.map((inst) => (
                                <div key={inst.id} className="flex justify-between text-xs text-gray-700">
                                  <span>{inst.name}</span>
                                  <span>{inst.amount.toLocaleString()} XAF</span>
                                  <span>
                                    Due:{" "}
                                    {inst.dueDate ? new Date(inst.dueDate).toLocaleDateString() : "-"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No fees created for this class yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
