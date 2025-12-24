"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function FeeDetail({ feeId }: { feeId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/fees/${feeId}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [feeId]);

  if (loading) return <p>Loading...</p>;
  if (data.error) return <p>{data.error}</p>;

  const { fee, installments, totalPaid, balance, status } = data;

  async function handlePayFull() {
  const res = await fetch(
    `/api/student/fees/${fee.id}/pay`,
    { method: "POST" }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Payment failed");
    return;
  }

  alert("Payment initiated successfully");
  window.location.reload();
}


  return (
    <div className="space-y-6">
      <div className="border rounded p-4">
        <h1 className="text-xl font-semibold">{fee.name}</h1>
        <p className="text-gray-600">{fee.term}</p>

        <div className="mt-4 space-y-1">
          <p>Total Fee: <b>{fee.amount.toLocaleString()} XAF</b></p>
          <p>Paid: <b>{totalPaid.toLocaleString()} XAF</b></p>
          <p>Balance: <b>{balance.toLocaleString()} XAF</b></p>
        </div>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
            status === "PAID"
              ? "bg-green-100 text-green-700"
              : status === "PARTIALLY PAID"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      {installments.length > 0 && (
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-3">Installments</h2>

          <ul className="space-y-2">
            {installments.map((inst: any) => (
              <li
                key={inst.id}
                className="flex justify-between border p-2 rounded"
              >
                <span>{inst.name}</span>
                <span>{inst.amount.toLocaleString()} XAF</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status !== "PAID" && (
        <Button className="w-full bg-assent" onClick={handlePayFull}>
            Pay Full Balance
        </Button>
      )}
    </div>
  );
}
