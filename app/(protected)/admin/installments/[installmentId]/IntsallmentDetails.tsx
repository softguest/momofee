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

type InstallmentStudent = {
  studentId: string;
  name: string;
  matricule: string;
  amountDue: number;
  amountPaid: number;
  status: "PAID" | "PARTIAL" | "UNPAID" | "OVERDUE";
  paidAt: string | null;
};


export default function InstallmentDetails({
  installmentId,
}: {
  installmentId: string;
}) {
  const [data, setData] = useState<InstallmentDetail | null>(null);
  const [students, setStudents] = useState<InstallmentStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!installmentId) return;

    async function fetchInstallment() {
      try {
        const res = await fetch(
          `/api/admin/installments/${installmentId}`
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load installment");
        }

        const result = await res.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    async function fetchStudents() {
    const res = await fetch(
      `/api/admin/installments/${installmentId}/students`
    );
    const data = await res.json();
    setStudents(data);
  }

    fetchStudents();
    fetchInstallment();
  }, [installmentId]);

  if (loading) return <WaterLoader label="Loading installment..." />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-2xl font-semibold">
        <div>Installment Details</div> <FiLayers />
      </div>

      {/* Details Card */}
      <div className="border rounded-lg p-6 space-y-4 bg-white">
        <div>
          <p className="text-gray-500 text-sm">Installment</p>
          <p className="font-semibold">{data.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Amount</p>
            <p className="font-medium">
              {data.amount.toLocaleString()} XAF
            </p>
          </div>

          <div>
            <p className="text-gray-500">Amount Paid</p>
            <p className="font-medium">
              {(data.amountPaid ?? 0).toLocaleString()} XAF
            </p>
          </div>

          <div>
            <p className="text-gray-500">Due Date</p>
            <p className="font-medium">
              {data.dueDate
                ? new Date(data.dueDate).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <StatusBadge status={data.status} />
          </div>
        </div>
      </div>
      {/* Students to pay this installments  */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">
          Students for this Installment
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th>Student</th>
                <th>Matricule</th>
                <th>Due</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td>{s.matricule}</td>
                  <td>{s.amountDue.toLocaleString()} XAF</td>
                  <td>{s.amountPaid.toLocaleString()} XAF</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* -------- STATUS BADGE -------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-700",
    UNPAID: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
  };

  return <Badge className={styles[status] ?? ""}>{status}</Badge>;
}
