"use client";

import React, { useEffect, useMemo, useState } from "react";

/* ---------------- TYPES ---------------- */

type Installment = {
  id: string;
  name: string;
  amount: number;
  dueDate: string | null;
  status?: "PAID" | "UNPAID";
};

type Fee = {
  id: string;
  name: string;
  term: string;
  academicYear: string;
  totalAmount: number;
  paymentType: "FULL" | "INSTALLMENT";
  createdAt: string;
  class: {
    id: string;
    name: string;
  };
  installments: Installment[];
};

type GroupedClass = {
  id: string;
  name: string;
  fees: Fee[];
};

import {
  ResponsiveTableRow,
  ResponsiveCell,
} from "@/components/ui/ResponsiveTable";
import WaterLoader from "@/components/loaders/WaterLoader";

/* ---------------- HELPERS ---------------- */

function isOverdue(dueDate?: string | null) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function calculatePaidStats(fee: Fee) {
  if (fee.paymentType === "FULL") {
    return {
      paid: 0,
      unpaid: fee.totalAmount,
      overdueCount: 0,
    };
  }

  const paid = fee.installments
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0);

  const unpaid = fee.totalAmount - paid;

  const overdueCount = fee.installments.filter(
    (i) => i.status !== "PAID" && isOverdue(i.dueDate)
  ).length;

  return { paid, unpaid, overdueCount };
}

/* ---------------- COMPONENT ---------------- */

export default function ClassFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFees() {
      try {
        const res = await fetch("/api/admin/class-fees");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load fees");
        }
        const data = await res.json();
        setFees(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFees();
  }, []);

  /* -------- GROUP FEES BY CLASS -------- */

  const groupedClasses: GroupedClass[] = useMemo(() => {
    const map = new Map<string, GroupedClass>();

    fees.forEach((fee) => {
      const classId = fee.class.id;

      if (!map.has(classId)) {
        map.set(classId, {
          id: classId,
          name: fee.class.name,
          fees: [],
        });
      }

      map.get(classId)!.fees.push(fee);
    });

    return Array.from(map.values());
  }, [fees]);

  /* ---------------- UI STATES ---------------- */

  if (loading) return <WaterLoader label="Loading fees..." />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (groupedClasses.length === 0)
    return <p className="p-6 text-gray-500">No fees found.</p>;

  /* ---------------- RENDER ---------------- */

  return (
   <div className="max-w-7xl mx-auto py-8 space-y-10">
    <h1 className="text-2xl font-semibold">Classes & Fees</h1>

    {groupedClasses.map((cls) => (
      <div key={cls.id} className="border rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-medium">{cls.name}</h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            {/* -------- TABLE HEADER (desktop only) -------- */}
            <thead className="hidden md:table-header-group bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold">Fee</th>
                <th className="p-3 text-left font-semibold">Term</th>
                <th className="p-3 text-left font-semibold">Year</th>
                <th className="p-3 text-right font-semibold">Total</th>
                <th className="p-3 text-right font-semibold">Paid</th>
                <th className="p-3 text-right font-semibold">Unpaid</th>
                <th className="p-3 text-center font-semibold">Overdue</th>
              </tr>
            </thead>

            <tbody>
              {cls.fees.map((fee) => {
                const stats = calculatePaidStats(fee);

                return (
                  <React.Fragment key={fee.id}>
                    {/* -------- FEE ROW -------- */}
                    <ResponsiveTableRow>
                      <ResponsiveCell label="Fee">
                        <span className="font-medium">{fee.name}</span>
                      </ResponsiveCell>

                      <ResponsiveCell label="Term">
                        {fee.term}
                      </ResponsiveCell>

                      <ResponsiveCell label="Year">
                        {fee.academicYear}
                      </ResponsiveCell>

                      <ResponsiveCell label="Total" align="right">
                        {fee.totalAmount.toLocaleString()} XAF
                      </ResponsiveCell>

                      <ResponsiveCell label="Paid" align="right">
                        <span className="text-green-700">
                          {stats.paid.toLocaleString()} XAF
                        </span>
                      </ResponsiveCell>

                      <ResponsiveCell label="Unpaid" align="right">
                        <span className="text-red-600">
                          {stats.unpaid.toLocaleString()} XAF
                        </span>
                      </ResponsiveCell>

                      <ResponsiveCell label="Overdue" align="center">
                        {stats.overdueCount > 0 ? (
                          <span className="text-red-600 font-semibold">
                            {stats.overdueCount}
                          </span>
                        ) : (
                          "—"
                        )}
                      </ResponsiveCell>
                    </ResponsiveTableRow>

                    {/* -------- INSTALLMENTS -------- */}
                    {fee.paymentType === "INSTALLMENT" &&
                      fee.installments.length > 0 && (
                        <ResponsiveTableRow className="bg-gray-50">
                          <td colSpan={7} className="md:p-3">
                            <div className="space-y-2 text-xs md:ml-4">
                              {fee.installments.map((inst) => (
                                <div
                                  key={inst.id}
                                  className="flex flex-col md:flex-row md:justify-between gap-1"
                                >
                                  <span className="font-medium">
                                    {inst.name}
                                  </span>
                                  <span>
                                    {inst.amount.toLocaleString()} XAF
                                  </span>
                                  <span>
                                    Due:{" "}
                                    {inst.dueDate
                                      ? new Date(
                                          inst.dueDate
                                        ).toLocaleDateString()
                                      : "-"}
                                  </span>
                                  <span
                                    className={
                                      inst.status === "PAID"
                                        ? "text-green-600"
                                        : isOverdue(inst.dueDate)
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }
                                  >
                                    {inst.status ?? "UNPAID"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </ResponsiveTableRow>
                      )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
  );
}
