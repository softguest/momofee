"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function StudentInstallmentsTable({
  classFeeId,
  studentId,
}: {
  classFeeId: string;
  studentId: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/admin/class-fees/${classFeeId}/installments?studentId=${studentId}`
    )
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [classFeeId, studentId]);

  if (loading) return <p>Loading installments...</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
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
              <td className="p-3">{i.amount.toLocaleString()} FCFA</td>
              <td className="p-3">
                {(i.amountPaid ?? 0).toLocaleString()} FCFA
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
  );
}

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
