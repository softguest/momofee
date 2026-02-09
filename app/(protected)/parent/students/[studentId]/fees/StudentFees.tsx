"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentFees({
  studentId,
  role = "parent",
}: {
  studentId?: string;
  role?: "student" | "parent";
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const url =
      role === "parent"
        ? `/api/parent/students/${studentId}/fees`
        : "/api/student/fees";

    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [studentId, role]);

  if (!data) return <p>Loading...</p>;
  if (data.error) return <p>{data.error}</p>;

  return (
    <div className="space-y-4">
      {data.fees.map((item: any) => (
        <div key={item.fee.id} className="border p-4 rounded flex justify-between">
          <div>
            <p className="font-semibold">{item.fee.name}</p>
            <p>Balance: {item.balance.toLocaleString()} XAF</p>
            <span className="text-sm">{item.status}</span>
          </div>

          <Link
            href={`/${role}/fees/${item.fee.id}?studentId=${data.student.id}`}
          >
            <button className="bg-assent cursor-pointer text-white px-4 py-2 rounded">
              View
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}