"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import WaterLoader from "@/components/loaders/WaterLoader";

export default function FeeDetail({ feeId }: { feeId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/student/fees/${feeId}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [feeId]);

  if (loading) return <WaterLoader label="Loading Fee Details..." />;
  if (data.error) return <p>{data.error}</p>;

  const { fee, installments, payments, totalPaid, balance, status } = data;

  /* ---------------- FULL FEE PAYMENT ---------------- */

  async function handlePayFull() {
    setPaying("FULL");

    const res = await fetch(`/api/student/fees/${fee.id}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: balance, // 🔥 important
      }),
    });

    const result = await res.json();
    setPaying(null);

    if (!res.ok) {
      alert(result.error || "Payment failed");
      return;
    }

    alert("Payment initiated successfully");
    window.location.reload();
  }


  /* ---------------- INSTALLMENT PAYMENT ---------------- */

  async function handlePayInstallment(installmentId: string) {
    setPaying(installmentId);

    const inst = installments.find((i: any) => i.id === installmentId);

    const res = await fetch(
      `/api/student/installments/${installmentId}/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: inst.amount, // 🔥 required
        }),
      }
    );

    const result = await res.json();
    setPaying(null);

    if (!res.ok) {
      alert(result.error || "Payment failed");
      return;
    }
    alert("Installment payment initiated");
    window.location.reload();
  }


  function isInstallmentPaid(installmentId: string) {
    return payments?.some(
      (p: any) =>
        p.installmentId === installmentId && p.status === "success"
    );
  }

  const isInstallmentPending = (installmentId: string) => {
  return payments.some(
    (p: any) =>
      p.installmentId === installmentId && p.status === "pending"
  );
};


  return (
    <div className="space-y-6">

      {/* -------- FEE SUMMARY -------- */}
      <div className="border rounded p-4">
        <h1 className="text-xl font-semibold">{fee.name}</h1>
        <hr className="my-2"/>
        <p className="text-gray-600">{fee.term}</p>

        <div className="text-white mt-4 p-2 bg-primary/70 space-y-1 rounded-md">
          <p>
            Total Fee: <b>{fee.totalAmount.toLocaleString()} XAF</b>
          </p>
          <p>
            Paid: <b>{totalPaid.toLocaleString()} XAF</b>
          </p>
          <p>
            Balance: <b>{balance.toLocaleString()} XAF</b>
          </p>
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

      {/* -------- INSTALLMENTS -------- */}
      {installments.length > 0 && (
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-3">Installments</h2>

            <ul className="space-y-3">
              {installments.map((inst: any) => {
                const paid = isInstallmentPaid(inst.id);
                const pending = isInstallmentPending(inst.id);

                return (
                  <li
                    key={inst.id}
                    className="flex bg-white  justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">{inst.name}</p>
                      <p className="text-sm text-gray-500">
                        {inst.amount.toLocaleString()} XAF
                      </p>
                    </div>

                    {/* ✅ PAID */}
                    {paid ? (
                      <span className="text-green-600 font-semibold">
                        PAID
                      </span>

                    /* 🟡 IN REVIEW */
                    ) : pending ? (
                      <span className="text-yellow-600 font-semibold border border-yellow-600/50 p-2">
                        In Review
                      </span>

                    /* 💳 PAY */
                    ) : (
                      <Button
                        size="sm"
                        disabled={paying === inst.id}
                        onClick={() => handlePayInstallment(inst.id)}
                      >
                        {paying === inst.id ? "Processing..." : "Pay"}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}


        {/* -------- FULL PAYMENT -------- */}
        {/* {status !== "PAID" && (
          <Button
            className="w-full bg-assent bg-accent"
            disabled={paying === "FULL"}
            onClick={handlePayFull}
          >
            {paying === "FULL" ? "Processing..." : "Pay Full Balance"}
          </Button>
        )} */}
      </div>
    );
  }
