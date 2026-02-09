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
import Link from "next/link";
import { FiPlayCircle } from "react-icons/fi";

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
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

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
   <div className="max-w-5xl mx-auto py-8 space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="flex items-center gap-2 text-2xl font-semibold">
      Fees <FiPlayCircle />
    </h1>

    <Link
      href="/admin/classes/create"
      className="bg-primary text-white px-4 py-2 rounded"
    >
      + New Class
    </Link>
  </div>
    <section className="mpy-10 py-12 bg-primary text-white rounded-md mb-8">
      <div className="px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
          List Of Created Fees
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        </div>
      </div>
    </section>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groupedClasses.map((cls) =>
        cls.fees.map((fee) => {
          const stats = calculatePaidStats(fee);

          return (
            <div
              key={fee.id}
              className="flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              {/* ---- TOP INFO ---- */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-semibold text-gray-900">
                    {cls.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Fee</p>
                  <p className="font-medium">{fee.name}</p>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Term</p>
                    <p>{fee.term}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Year</p>
                    <p>{fee.academicYear}</p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-medium">
                      {fee.totalAmount.toLocaleString()} XAF
                    </span>
                  </div>

                  <div className="flex justify-between text-green-700">
                    <span>Paid</span>
                    <span>
                      {stats.paid.toLocaleString()} XAF
                    </span>
                  </div>

                  <div className="flex justify-between text-red-600">
                    <span>Unpaid</span>
                    <span>
                      {stats.unpaid.toLocaleString()} XAF
                    </span>
                  </div>

                  {stats.overdueCount > 0 && (
                    <div className="flex justify-between text-red-700 font-semibold">
                      <span>Overdue</span>
                      <span>{stats.overdueCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ---- ACTION ---- */}
              <div className="mt-5">
                {fee.paymentType === "INSTALLMENT" ? (
                  <button
                    onClick={() => setSelectedFee(fee)}
                    className="cursor-pointer w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    View Installments
                  </button>
                ) : (
                  <span className="block text-center text-xs text-gray-400">
                    Full payment fee
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
    {selectedFee && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-lg rounded-xl bg-white shadow-lg animate-in fade-in zoom-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">
            {selectedFee.name}
          </h2>
          <p className="text-xs text-gray-500">
            {selectedFee.term} • {selectedFee.academicYear}
          </p>
        </div>

        <button
          onClick={() => setSelectedFee(null)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {selectedFee.installments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No installments defined for this fee.
          </p>
        ) : (
          selectedFee.installments.map((inst) => (
            <div
              key={inst.id}
              className="bg-accent/10 "
            >
              <Link href={`/admin/installments/${inst.id}`} className="flex justify-between items-center rounded-lg border p-3 text-sm">
                <div>
                  <p className="font-medium">{inst.name}</p>
                  <p className="text-xs text-gray-500">
                    Due:{" "}
                    {inst.dueDate
                      ? new Date(inst.dueDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {inst.amount.toLocaleString()} XAF
                  </p>
                  <span
                    className={
                      inst.status === "PAID"
                        ? "text-green-600 text-xs font-medium"
                        : isOverdue(inst.dueDate)
                        ? "text-red-600 text-xs font-medium"
                        : "text-gray-600 text-xs"
                    }
                  >
                    {inst.status ?? "UNPAID"}
                  </span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-3 flex justify-end">
        <button
          onClick={() => setSelectedFee(null)}
          className="rounded-md bg-gray-100 cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

</div>

  );
}
