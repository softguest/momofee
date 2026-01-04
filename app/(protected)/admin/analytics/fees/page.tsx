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
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-semibold">
        Fee Collection Analytics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Billed" value={summary.totalBilled} />
        <StatCard title="Collected" value={summary.totalCollected} />
        <StatCard title="Outstanding" value={summary.outstanding} />
        <StatCard title="Collection Rate" value={`${summary.collectionRate}%`} />
      </div>

      {/* Per Class Table */}
      <div className="border rounded overflow-hidden">
  <table className="w-full text-sm">
    {/* Desktop header */}
    <thead className="hidden md:table-header-group bg-gray-100">
      <tr>
        <th className="p-3 text-left">Class</th>
        <th className="p-3 text-left">Billed</th>
        <th className="p-3 text-left">Collected</th>
        <th className="p-3 text-left">Outstanding</th>
        <th className="p-3 text-left">Rate</th>
      </tr>
    </thead>

    <tbody>
      {classes.map((cls: any) => (
        <tr
          key={cls.classId}
          className="
            border-t
            md:table-row
            block
            md:border-0
            p-4
            md:p-0
            space-y-2
            md:space-y-0
          "
        >
          {/* Class */}
          <td className="md:p-3 block md:table-cell">
            <span className="font-semibold text-gray-500 md:hidden">
              Class
            </span>
            <p className="md:inline">{cls.className}</p>
          </td>

          {/* Billed */}
          <td className="block md:table-cell">
            <span className="font-semibold text-gray-500 md:hidden">
              Billed
            </span>
            <p>{cls.billed.toLocaleString()} XAF</p>
          </td>

          {/* Collected */}
          <td className="block md:table-cell">
            <span className="font-semibold text-gray-500 md:hidden">
              Collected
            </span>
            <p>{cls.collected.toLocaleString()} XAF</p>
          </td>

          {/* Outstanding */}
          <td className="block md:table-cell">
            <span className="font-semibold text-gray-500 md:hidden">
              Outstanding
            </span>
            <p>{cls.outstanding.toLocaleString()} XAF</p>
          </td>

          {/* Rate */}
          <td className="block md:table-cell">
            <span className="font-semibold text-gray-500 md:hidden">
              Rate
            </span>
            <p>{cls.rate}%</p>
          </td>
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
