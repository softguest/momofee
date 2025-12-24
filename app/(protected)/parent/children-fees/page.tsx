"use client";

import { useEffect, useState } from "react";

type Installment = { id: string; name: string; amount: number; payments: { status: string }[] };
type Fee = { id: string; name: string; amount: number; installments: Installment[] };
type Student = { id: string; firstName: string; lastName: string; fees: Fee[] };

export default function ParentDashboard() {
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChildren() {
      const res = await fetch("/api/parent/children-fees");
      const data = await res.json();
      setChildren(data.children ?? []);
      setLoading(false);
    }
    fetchChildren();
  }, []);

  async function payInstallment(studentId: string, installmentId: string, amount: number) {
    const momoId = prompt("Enter Momo transaction ID:");
    if (!momoId) return;

    await fetch("/api/parent/payments", {
      method: "POST",
      body: JSON.stringify({ studentId, installmentId, amount, momoTransactionId: momoId }),
    });

    alert("Payment submitted! Status: pending");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Children’s Fees</h1>
      {children.map((child) => (
        <div key={child.id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">{child.firstName} {child.lastName}</h2>
          {child.fees.map((fee) => (
            <div key={fee.id} className="ml-4 mt-2">
              <h3 className="font-medium">{fee.name} - {fee.amount}</h3>
              {fee.installments.map((inst) => (
                <div key={inst.id} className="flex justify-between my-1">
                  <span>{inst.name} - {inst.amount}</span>
                  <span>
                    Status: {inst.payments[0]?.status ?? "pending"}
                    <button
                      onClick={() => payInstallment(child.id, inst.id, inst.amount)}
                      className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Pay
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
