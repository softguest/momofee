"use client";

import { useEffect, useState } from "react";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/payments/history")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Payment History
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t space-x-4">
              <td className="p-2">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
              <td>{p.amount.toLocaleString()} XAF</td>
              <td>{p.status}</td>
              <td>{p.momoTransactionId || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
