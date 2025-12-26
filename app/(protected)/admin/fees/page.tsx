"use client";

import { useEffect, useState } from "react";

type ClassFee = {
  id: string;
  name: string;
  term: string;
  totalAmount: number;
  paymentType: string;
};

type ClassItem = {
  id: string;
  name: string;
  academicYear: string;
  createdAt: string;
  fees?: ClassFee[];
};

export default function ClassesClient() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading classes...</div>;

  if (classes.length === 0)
    return <div className="p-6 text-gray-500">No classes created yet.</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Classes & Fees</h1>

      {classes.map((c) => (
        <div key={c.id} className="border rounded mb-6 p-4">
          <h2 className="text-xl font-medium">{c.name}</h2>
          <p className="text-gray-500">Academic Year: {c.academicYear}</p>
          <p className="text-gray-500">Created At: {new Date(c.createdAt).toLocaleDateString()}</p>

          {/* Class Fees Table */}
          {c.fees && c.fees.length > 0 ? (
            <table className="w-full border mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Fee Name</th>
                  <th>Term</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                </tr>
              </thead>
              <tbody>
                {c.fees.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="p-2">{f.name}</td>
                    <td>{f.term}</td>
                    <td>{f.totalAmount.toLocaleString()} XAF</td>
                    <td>{f.paymentType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-2">No fees created for this class yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
