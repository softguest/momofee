"use client";

import { useEffect, useState } from "react";

type ClassFee = {
  id: string;
  classId: string;
  name: string;
  academicYear: string;
  description?: string | null;
  term: string;
  totalAmount: number;
  paymentType: "FULL" | "INSTALLMENT";
  createdAt: string;
};

type ClassItem = {
  id: string;
  name: string;
  academicYear: string;
  createdAt: string;
  fees: ClassFee[];
};

export default function ClassesClient() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/class-fees")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Loading class fees…</div>;

  if (classes.length === 0)
    return <div className="p-6 text-gray-500">No classes found.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Classes & Fees</h1>

      {classes.map((c) => (
        <div key={c.id} className="border rounded-lg mb-6 p-5">
          <div className="mb-3">
            <h2 className="text-xl font-medium">{c.name}</h2>
            <p className="text-sm text-gray-500">
              Academic Year: {c.academicYear}
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </div>

          {c.fees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border mt-4 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Fee Name</th>
                    <th className="text-left">Term</th>
                    <th className="text-left">Academic Year</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {c.fees.map((f) => (
                    <tr key={f.id} className="border-t">
                      <td className="p-2">
                        <div className="font-medium">{f.name}</div>
                        {f.description && (
                          <div className="text-xs text-gray-500">
                            {f.description}
                          </div>
                        )}
                      </td>
                      <td>{f.term}</td>
                      <td>{f.academicYear}</td>
                      <td className="text-right">
                        {f.totalAmount.toLocaleString()} XAF
                      </td>
                      <td className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            f.paymentType === "FULL"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {f.paymentType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-3">
              No fees created for this class yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
