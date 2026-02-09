"use client";

import WaterLoader from "@/components/loaders/WaterLoader";
// import WaterLoader from "@/components/loaders/WaterLoader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiEye, FiPlayCircle } from "react-icons/fi";

type Installment = {
  installmentId: string;
  installmentName: string;
  amount: number;
  dueDate: string | null;
  createdAt: string;

  feeName: string;
  paymentType: "FULL" | "INSTALLMENT";
  totalAmount: number;
  term: string;
  academicYear: string;

  className: string;
};

export default function AdminInstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/installments")
      .then((res) => res.json())
      .then((data) => {
        setInstallments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <WaterLoader label="Loading Installments..." />;
  }

  if (installments.length === 0) {
    return <div className="p-6 text-gray-500">No installments found.</div>;
  }

  function isOverdue(dueDate: string | null) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">Installments <FiPlayCircle/></h1>

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
            List Of Created Classes
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>

      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 p-4 text-sm border-b">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Overdue installment</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
            <span>Upcoming / No due date</span>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          {/* Desktop header */}
          <thead className="hidden md:table-header-group bg-gray-100">
            <tr>
              <th className="p-3 text-left">Installment</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Due Date</th>
              <th className="p-3 text-center">Payment Type</th>
              <th className="p-3 text-left">Options</th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {installments.map((i) => {
              const overdue = isOverdue(i.dueDate);

              return (
                <tr
                  key={i.installmentId}
                  className={`
                    block
                    md:table-row
                    border-b
                    md:border-0
                    p-4
                    md:p-0
                    ${overdue ? "bg-red-50" : ""}
                  `}
                >
                  {/* Installment */}
                  <td className="block md:table-cell md:p-3">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Installment
                      </span>
                      <span className="font-medium">
                        {i.installmentName}
                      </span>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="block md:table-cell md:p-3">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Class
                      </span>
                      <span>{i.className}</span>
                    </div>
                  </td>

                  {/* Fee */}
                  <td className="block md:table-cell md:p-3">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Fee
                      </span>
                      <span>{i.feeName}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="block md:table-cell md:p-3 md:text-right">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Amount
                      </span>
                      <span className="font-semibold">
                        {i.amount.toLocaleString()} XAF
                      </span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="block md:table-cell md:p-3 md:text-center">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Due Date
                      </span>
                      {i.dueDate ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            overdue
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {new Date(i.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </td>

                  {/* Payment Type */}
                  <td className="block md:table-cell md:p-3 md:text-center">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Payment Type
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          i.paymentType === "INSTALLMENT"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {i.paymentType}
                      </span>
                    </div>
                  </td>

                  {/* Options */}
                  <td className="block md:table-cell md:p-3">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-semibold">
                        Options
                      </span>
                      <Link
                        href={`/admin/installments/${i.installmentId}`}
                        className="text-blue-600 cursor-pointer font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
