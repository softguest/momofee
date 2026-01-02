"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Payment = {
  id: string;
  amount: number;
  status: "success" | "pending" | "failed";
  momoTransactionId?: string;
  createdAt: string;
  student: {
    studentCode: string;
    firstName: string;
    lastName: string;
  };
  class: {
    name: string;
  };
  fee: {
    name: string;
  };
  installment?: {
    name: string;
  };
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then(res => res.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading payments...</p>;

  return (
    <Card className="max-w-5xl mx-auto p-2 space-y-4">
      <h1 className="text-xl font-semibold mb-4">All Payments</h1>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Recent Payments
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2">Class</th>
              <th className="p-2">Fee</th>
              <th className="p-2">Installment</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  <div className="font-medium">
                    {p.student.firstName} {p.student.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.student.studentCode}
                  </div>
                </td>

                <td className="p-2">{p.class.name}</td>
                <td className="p-2">{p.fee.name}</td>
                <td className="p-2">{p.installment?.name || "Full Payment"}</td>
                <td className="p-2 font-semibold">{p.amount.toLocaleString()} FCFA</td>

                <td className="p-2">
                  <Badge
                    variant={
                      p.status === "success"
                        ? "default"
                        : p.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {p.status}
                  </Badge>
                </td>

                <td className="p-2 text-sm">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
