"use client";

import { useEffect, useState } from "react";

export default function OverdueInstallments() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics/overdue-installments")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Overdue Installments
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Fee</th>
            <th>Installment</th>
            <th>Due Date</th>
            <th>Expected</th>
            <th>Paid</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i.installmentId} className="border-t">
              <td className="p-2">{i.feeName}</td>
              <td>{i.installment}</td>
              <td>{new Date(i.dueDate).toLocaleDateString()}</td>
              <td>{i.expected.toLocaleString()} XAF</td>
              <td>{i.paid.toLocaleString()} XAF</td>
              <td className="text-red-600">
                {i.balance.toLocaleString()} XAF
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
