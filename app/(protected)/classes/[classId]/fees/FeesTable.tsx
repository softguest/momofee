"use client";

import { useEffect, useState } from "react";

type Fee = {
  id: string;
  name: string;
  term: string;
  amount: number;
  installments: { id: string }[];
};

export default function FeesTable({
  classId,
  role,
}: {
  classId: string;
  role: "admin" | "student" | "parent";
}) {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/classes/${classId}/fees`)
      .then((res) => res.json())
      .then(setFees)
      .finally(() => setLoading(false));
  }, [classId]);

  // if (loading) return <p>Loading fees...</p>;

  if (fees.length === 0)
    return <p className="text-gray-500">No fees created yet.</p>;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Fee</th>
            <th className="p-3">Term</th>
            <th className="p-3">Amount (XAF)</th>
            <th className="p-3">Type</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id} className="border-t">
              <td className="p-3">{fee.name}</td>
              <td className="p-3 text-center">{fee.term}</td>
              <td className="p-3 text-center">
                {fee.amount.toLocaleString()}
              </td>
              <td className="p-3 text-center">
                {fee.installments.length > 0 ? "Installments" : "Full"}
              </td>
              <td className="p-3 text-center">
                {role === "admin" ? (
                  <a
                    href={`/admin/fees/${fee.id}`}
                    className="text-blue-600 underline"
                  >
                    Manage
                  </a>
                ) : (
                  <a
                    href={`/student/fees/${fee.id}`}
                    className="text-green-600 cursor-pointer underline"
                  >
                    View & Pay
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
