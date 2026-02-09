// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// type UnpaidStudent = {
//   studentId: string;
//   name: string;
//   totalBilled: number;
//   totalPaid: number;
//   balance: number;
//   status: string;
// };

// export default function UnpaidStudentsClient({
//   classId,
// }: {
//   classId: string;
// }) {
//   const [data, setData] = useState<UnpaidStudent[]>([]);

//   useEffect(() => {
//     fetch(`/api/admin/classes/${classId}/unpaid-students`)
//       .then((res) => res.json())
//       .then(setData);
//   }, [classId]);

//   return (
//     <div className="max-w-5xl mx-auto py-8">
//       <h1 className="text-2xl font-semibold mb-6">Unpaid Students</h1>

//       <table className="w-full border text-sm">
//         {/* Desktop header */}
//         <thead className="hidden md:table-header-group bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">Student</th>
//             <th className="p-3 text-left">Billed</th>
//             <th className="p-3 text-left">Paid</th>
//             <th className="p-3 text-left">Balance</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left"></th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((s) => (
//             <tr
//               key={s.studentId}
//               className="
//                 border-t
//                 md:table-row
//                 block
//                 p-4
//                 md:p-0
//                 space-y-2
//                 md:space-y-0
//               "
//             >
//               {/* Student */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Student
//                   </span>
//                   <span className="font-medium">{s.name}</span>
//                 </div>
//               </td>

//               {/* Billed */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Billed
//                   </span>
//                   <span>{s.totalBilled.toLocaleString()} XAF</span>
//                 </div>
//               </td>

//               {/* Paid */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Paid
//                   </span>
//                   <span>{s.totalPaid.toLocaleString()} XAF</span>
//                 </div>
//               </td>

//               {/* Balance */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Balance
//                   </span>
//                   <span className="font-semibold">
//                     {s.balance.toLocaleString()} XAF
//                   </span>
//                 </div>
//               </td>

//               {/* Status */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Status
//                   </span>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       s.status === "PAID"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {s.status}
//                   </span>
//                 </div>
//               </td>

//               {/* Action */}
//               <td className="block md:table-cell md:p-3">
//                 <div className="flex justify-between md:block">
//                   <span className="md:hidden text-gray-500 font-semibold">
//                     Action
//                   </span>
//                   <Link
//                     href={`/admin/students/${s.studentId}/fees`}
//                     className="text-blue-600 font-medium"
//                   >
//                     View →
//                   </Link>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveTableRow,
  ResponsiveCell,
} from "@/components/ui/ResponsiveTable";

type UnpaidStudent = {
  studentId: string;
  name: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  status: string;
};

export default function UnpaidStudentsClient({
  classId,
}: {
  classId: string;
}) {
  const [data, setData] = useState<UnpaidStudent[]>([]);

  useEffect(() => {
    fetch(`/api/admin/classes/${classId}/unpaid-students`)
      .then((res) => res.json())
      .then(setData);
  }, [classId]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Unpaid Students
      </h1>

      <table className="w-full border text-sm">
        {/* Desktop header */}
        <thead className="hidden md:table-header-group bg-gray-100">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3">Billed</th>
            <th className="p-3">Paid</th>
            <th className="p-3">Balance</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((s) => (
            <ResponsiveTableRow key={s.studentId}>
              <ResponsiveCell label="Student">
                <span className="font-medium">{s.name}</span>
              </ResponsiveCell>

              <ResponsiveCell label="Billed">
                {s.totalBilled.toLocaleString()} XAF
              </ResponsiveCell>

              <ResponsiveCell label="Paid">
                {s.totalPaid.toLocaleString()} XAF
              </ResponsiveCell>

              <ResponsiveCell label="Balance">
                <span className="font-semibold">
                  {s.balance.toLocaleString()} XAF
                </span>
              </ResponsiveCell>

              <ResponsiveCell label="Status">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    s.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.status}
                </span>
              </ResponsiveCell>

              <ResponsiveCell label="Action">
                <Link
                  href={`/admin/students/${s.studentId}`}
                  className="text-blue-600 cursor-pointer font-medium"
                >
                  View →
                </Link>
              </ResponsiveCell>
            </ResponsiveTableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
