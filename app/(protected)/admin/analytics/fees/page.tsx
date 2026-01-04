"use client";

import WaterLoader from "@/components/loaders/WaterLoader";
import { useEffect, useState } from "react";
import {
  ResponsiveTableRow,
  ResponsiveCell,
} from "@/components/ui/ResponsiveTable";

export default function AdminFeeAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics/fees")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <WaterLoader label="Loading Analytics..." />;

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
        <StatCard
          title="Collection Rate"
          value={`${summary.collectionRate}%`}
        />
      </div>

      {/* Per Class Table */}
      <div className="border rounded-lg overflow-hidden">
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
              <ResponsiveTableRow key={cls.classId}>
                <ResponsiveCell label="Class">
                  <span className="font-medium">{cls.className}</span>
                </ResponsiveCell>

                <ResponsiveCell label="Billed">
                  {cls.billed.toLocaleString()} XAF
                </ResponsiveCell>

                <ResponsiveCell label="Collected">
                  {cls.collected.toLocaleString()} XAF
                </ResponsiveCell>

                <ResponsiveCell label="Outstanding">
                  {cls.outstanding.toLocaleString()} XAF
                </ResponsiveCell>

                <ResponsiveCell label="Rate">
                  {cls.rate}%
                </ResponsiveCell>
              </ResponsiveTableRow>
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
