"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentFees() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/fees")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (data?.error) return <p className="text-center text-red-500">{data.error}</p>;

  const { student, fees } = data;

  return (
    <div className="space-y-8">
      {/* Student Info */}
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Student Class Fees
          </h2>

          <p className="text-lg text-center font-semibold text-white mt-2">
            Student: {student.firstName} {student.lastName}
          </p>
        </div>
      </section>

      {/* Fees Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fees.map((item: any, idx: number) => {
          const percentPaid = Math.min(
            (item.totalPaid / item.fee.totalAmount) * 100,
            100
          );

          return (
            <div
              key={item.fee.id}
              className={`bg-white shadow hover:shadow-lg transition rounded-lg p-6 flex flex-col justify-between opacity-0 animate-fade-in`}
              style={{ animationDelay: `${idx * 150}ms`, animationFillMode: "forwards" }}
            >
              <div>
                <p className="text-lg font-bold text-gray-900">{item.fee.name}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Total: <span className="font-medium">{item.fee.totalAmount.toLocaleString()} XAF</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Paid: <span className="font-medium">{item.totalPaid.toLocaleString()} XAF</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Balance: <span className="font-medium">{item.balance.toLocaleString()} XAF</span>
                </p>

                {/* Animated Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                        percentPaid === 100
                          ? "bg-green-500"
                          : percentPaid >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentPaid}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentPaid.toFixed(0)}% Paid</p>
                </div>
              </div>

              {/* Status + Action */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : item.status === "PARTIALLY PAID"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
                <Link href={`/student/fees/${item.fee.id}`}>
                  <button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm rounded-md transition">
                    View
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
