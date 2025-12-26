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

  if (loading) return <p>Loading...</p>;
  if (data?.error) return <p>{data.error}</p>;

  const { student, fees } = data;

  return (
    <div className="space-y-6">
      <div className="border rounded p-4">
        <p className="font-medium">
          Student: {student.firstName} {student.lastName}
        </p>
      </div>

      <div className="space-y-4">
        {fees.map((item: any) => (
          <div
            key={item.fee.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.fee.name}</p>
              <p className="text-sm text-gray-600">
                Total: {item.fee.totalAmount.toLocaleString()} XAF
              </p>
              <p className="text-sm text-gray-600">
                Paid: {item.totalPaid.toLocaleString()} XAF
              </p>
              <p className="text-sm text-gray-600">
                Balance: {item.balance.toLocaleString()} XAF
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-xs ${
                  item.status === "PAID"
                    ? "bg-green-100 text-green-700"
                    : item.status === "PARTIALLY PAID"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <Link href={`/student/fees/${item.fee.id}`}>
              <button className="px-4 py-2 bg-assent text-white rounded">
                View
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function StudentFees({
//   studentId,
//   role = "student",
// }: {
//   studentId?: string;
//   role?: "student" | "parent";
// }) {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     const url =
//       role === "parent"
//         ? `/api/parent/students/${studentId}/fees`
//         : "/api/student/fees";

//     fetch(url)
//       .then((res) => res.json())
//       .then(setData);
//   }, [studentId, role]);

//   if (!data) return <p>Loading...</p>;
//   if (data.error) return <p>{data.error}</p>;

//   return (
//     <div className="space-y-4">
//       {data.fees.map((item: any) => (
//         <div key={item.fee.id} className="border p-4 rounded flex justify-between">
//           <div>
//             <p className="font-semibold">{item.fee.name}</p>
//             <p>Balance: {item.balance.toLocaleString()} XAF</p>
//             <span className="text-sm">{item.status}</span>
//           </div>

//           <Link
//             href={`/${role}/fees/${item.fee.id}?studentId=${data.student.id}`}
//           >
//             <button className="bg-assent text-white px-4 py-2 rounded">
//               View
//             </button>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }
