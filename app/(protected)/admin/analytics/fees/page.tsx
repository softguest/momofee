"use client";

import { useEffect, useState } from "react";

export default function AdminFeeAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics/fees")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  const { summary, classes } = data;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-semibold">
        Fee Collection Analytics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Billed" value={summary.totalBilled} />
        <StatCard title="Collected" value={summary.totalCollected} />
        <StatCard title="Outstanding" value={summary.outstanding} />
        <StatCard title="Collection Rate" value={`${summary.collectionRate}%`} />
      </div>

      {/* Per Class Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th>Billed</th>
              <th>Collected</th>
              <th>Outstanding</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls: any) => (
              <tr key={cls.classId} className="border-t">
                <td className="p-3">{cls.className}</td>
                <td>{cls.billed.toLocaleString()} XAF</td>
                <td>{cls.collected.toLocaleString()} XAF</td>
                <td>{cls.outstanding.toLocaleString()} XAF</td>
                <td>{cls.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="border rounded px-4 py-8 bg-primary">
      <p className="text-sm text-gray-200">{title}</p>
      <p className="text-xl font-semibold text-white">
        {typeof value === "number"
          ? value.toLocaleString() + " XAF"
          : value}
      </p>
    </div>
  );
}
