"use client";

import { useEffect, useState } from "react";

type Fee = {
  id: string;
  classFeeId: string;
  amount: number;
  name: string;
  installments: {
    id: string;
    name: string;
    amount: number;
    payments: { status: string }[];
  }[];
  payments: { status: string }[];
};

export default function StudentFeeDashboard() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFees() {
      const res = await fetch("/api/student/fees");
      const data = await res.json();
      setFees(data.fees ?? []);
      setLoading(false);
    }
    fetchFees();
  }, []);

  async function payInstallment(installmentId: string, amount: number) {
    const momoId = prompt("Enter Momo transaction ID:"); // replace with real integration
    if (!momoId) return;

    await fetch("/api/student/payments", {
      method: "POST",
      body: JSON.stringify({ installmentId, amount, momoTransactionId: momoId }),
    });

    alert("Payment submitted! Status: pending");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Fees & Installments</h1>
      {fees.map((fee) => (
        <div key={fee.id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">{fee.name} - Total: {fee.amount}</h2>
          <div className="ml-4 mt-2">
            {fee.installments.map((inst) => (
              <div key={inst.id} className="flex justify-between my-1">
                <span>{inst.name} - {inst.amount}</span>
                <span>
                  Status: {inst.payments[0]?.status ?? "pending"}
                  <button
                    onClick={() => payInstallment(inst.id, inst.amount)}
                    className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Pay
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
