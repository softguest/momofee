"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>No students linked.</p>;

  return (
    <div className="space-y-8">
      {data.map(({ student, fees, payments }) => (
        <div
          key={student.id}
          className="border rounded p-4 space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-500">
              Class: {student.class.name}
            </p>
          </div>

          <div className="space-y-3">
            {fees.map((fee: any) => {
              const paid = payments
                .filter((p: any) => p.classFeeId === fee.id && p.status === "success")
                .reduce((sum: number, p: any) => sum + p.amount, 0);

              const balance = fee.amount - paid;

              return (
                <div
                  key={fee.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{fee.name}</p>
                    <p className="text-sm text-gray-500">
                      Balance: {balance.toLocaleString()} XAF
                    </p>
                  </div>

                  <a
                    href={`/parent/fees/${fee.id}?studentId=${student.id}`}
                  >
                    <Button size="sm">
                      Pay
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
