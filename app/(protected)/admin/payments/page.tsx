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
    <Card className="max-w-5xl mx-auto p-2 space-y-6">
      <h1 className="text-xl font-semibold">
        All Payments
      </h1>

      {/* Hero / Summary Section */}
      <section className="px-4 py-10 bg-primary text-white rounded-md">
        <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
          Recent Payments
        </h2>

        <div className="
          mt-12
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4 sm:gap-5 md:gap-6
        ">
          {/* cards go here */}
        </div>
      </section>

      {/* Payments Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm border-collapse">
          {/* Desktop Header */}
          <thead className="hidden md:table-header-group bg-muted">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Installment</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Date</th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {payments.map((p) => (
              <tr
                key={p.id}
                className="
                  block
                  md:table-row
                  border-b
                  md:border-0
                  p-4
                  md:p-0
                "
              >
                {/* Student */}
                <td className="block md:table-cell md:p-3">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Student
                    </span>
                    <div>
                      <div className="font-medium">
                        {p.student.firstName} {p.student.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.student.studentCode}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Class */}
                <td className="block md:table-cell md:p-3">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Class
                    </span>
                    <span>{p.class.name}</span>
                  </div>
                </td>

                {/* Fee */}
                <td className="block md:table-cell md:p-3">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Fee
                    </span>
                    <span>{p.fee.name}</span>
                  </div>
                </td>

                {/* Installment */}
                <td className="block md:table-cell md:p-3">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Installment
                    </span>
                    <span>
                      {p.installment?.name || "Full Payment"}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="block md:table-cell md:p-3 md:text-right">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Amount
                    </span>
                    <span className="font-semibold">
                      {p.amount.toLocaleString()} FCFA
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="block md:table-cell md:p-3 md:text-center">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Status
                    </span>
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
                  </div>
                </td>

                {/* Date */}
                <td className="block md:table-cell md:p-3 md:text-center">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-semibold">
                      Date
                    </span>
                    <span>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

  );
}
