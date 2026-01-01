"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

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
    return <div className="p-6 text-gray-500">Loading installments…</div>;
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
      <h1 className="text-2xl font-semibold mb-6">
        Fee Installments
      </h1>

      <div className="overflow-x-auto border rounded-lg">
        <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 p-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Overdue installment</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-full" />
                <span>Upcoming / No due date</span>
            </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Installment</th>
              <th className="text-left">Class</th>
              <th className="text-left">Fee</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Due Date</th>
              <th className="text-center">Payment Type</th>
              <th className="text-left">Options</th>
            </tr>
          </thead>
          {/* <tbody>
            {installments.map((i) => (
              <tr key={i.installmentId} className="border-t">
                <td className="p-3 font-medium">
                  {i.installmentName}
                </td>
                <td>{i.className}</td>
                <td>{i.feeName}</td>
                <td className="text-right">
                  {i.amount.toLocaleString()} XAF
                </td>
                <td className="text-center">
                  {i.dueDate
                    ? new Date(i.dueDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      i.paymentType === "INSTALLMENT"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {i.paymentType}
                  </span>
                </td>
                <td><Button variant="outline"><FiEye /> <span className="ml-2">view</span></Button></td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
            {installments.map((i) => {
                const overdue = isOverdue(i.dueDate);

                return (
                <tr
                    key={i.installmentId}
                    className={`border-t ${
                    overdue ? "bg-red-50" : ""
                    }`}
                >
                    <td className="p-3 font-medium">
                    {i.installmentName}
                    </td>

                    <td>{i.className}</td>

                    <td>{i.feeName}</td>

                    <td className="text-right font-semibold">
                    {i.amount.toLocaleString()} XAF
                    </td>

                    <td className="text-center">
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
                        "—"
                    )}
                    </td>

                    <td className="text-center">
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                            i.paymentType === "INSTALLMENT"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                            {i.paymentType}
                        </span>
                    </td>
                    <td>
                         <Link
                            href={`/admin/installments/${i.installmentId}`}
                            className="text-blue-600"
                        >
                            View
                        </Link>
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
