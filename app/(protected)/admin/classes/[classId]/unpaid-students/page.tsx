// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default async function UnpaidStudentsPage({
//   params,}: {
//   params: Promise<{ classId: string }>;
// }) {
//     const { classId } =await params
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     fetch(`/api/admin/classes/${classId}/unpaid-students`)
//       .then((res) => res.json())
//       .then(setData);
//   }, [classId]);

//   return (
//     <div className="max-w-5xl mx-auto py-8">
//       <h1 className="text-2xl font-semibold mb-6">
//         Unpaid Students
//       </h1>

//       <table className="w-full border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 text-left">Student</th>
//             <th>Billed</th>
//             <th>Paid</th>
//             <th>Balance</th>
//             <th>Status</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((s) => (
//             <tr key={s.studentId} className="border-t">
//               <td className="p-2">{s.name}</td>
//               <td>{s.totalBilled.toLocaleString()} XAF</td>
//               <td>{s.totalPaid.toLocaleString()} XAF</td>
//               <td>{s.balance.toLocaleString()} XAF</td>
//               <td>{s.status}</td>
//               <td>
//                 <Link
//                   href={`/admin/students/${s.studentId}/fees`}
//                   className="text-blue-600"
//                 >
//                   View
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import UnpaidStudentsClient from "./UnpaidStudentsClient";

export default function Page({
  params,
}: {
  params: { classId: string };
}) {
  return <UnpaidStudentsClient classId={params.classId} />;
}