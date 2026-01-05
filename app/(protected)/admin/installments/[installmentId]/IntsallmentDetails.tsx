"use client";

import { useEffect, useState } from "react";
import { FiLayers } from "react-icons/fi";
import WaterLoader from "@/components/loaders/WaterLoader";
import { Badge } from "@/components/ui/badge";

type InstallmentDetail = {
  id: string;
  name: string;
  amount: number;
  dueDate: string | null;

  amountPaid: number | null;
  status: "PAID" | "PARTIAL" | "UNPAID" | "OVERDUE";
  paidAt: string | null;
};

export default function InstallmentDetails({
  classFeeId,
  studentId,
}: {
  classFeeId: string;
  studentId: string;
}) {
  const [data, setData] = useState<InstallmentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstallments() {
      try {
        const res = await fetch(
          `/api/admin/class-fees/${classFeeId}/installments?studentId=${studentId}`
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load installments");
        }

        const result = await res.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInstallments();
  }, [classFeeId, studentId]);

  if (loading) return <WaterLoader label="Loading installment details..." />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data.length)
    return <p className="text-gray-500">No installments found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* -------- HEADER -------- */}
      <div className="flex items-center space-x-2 text-2xl font-semibold">
        <div>Installment Details</div> <FiLayers />
      </div>

      {/* -------- INSTALLMENTS -------- */}
      <div className="border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Installment</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-3 font-medium">{i.name}</td>

                <td className="p-3">
                  {i.amount.toLocaleString()} XAF
                </td>

                <td className="p-3">
                  {(i.amountPaid ?? 0).toLocaleString()} XAF
                </td>

                <td className="p-3">
                  {i.dueDate
                    ? new Date(i.dueDate).toLocaleDateString()
                    : "—"}
                </td>

                <td className="p-3">
                  <StatusBadge status={i.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-700",
    UNPAID: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
  };

  return (
    <Badge className={styles[status] ?? ""}>
      {status}
    </Badge>
  );
}
