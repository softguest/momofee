// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";

// type StudentStatus = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   studentCode: string;
//   status: "PAID" | "UNPAID";
// };

// type Installment = {
//   id: string;
//   name: string;
//   amount: number;
//   dueDate: string | null;
//   students: StudentStatus[];
// };

// export default function InstallmentsStatusPage() {
//   const { feeId } = useParams<{ feeId: string }>();

//   const [installments, setInstallments] = useState<Installment[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!feeId) return;

//     async function load() {
//       const res = await fetch(
//         `/api/admin/class-fees/${feeId}/installments/status`
//       );
//       const data = await res.json();
//       setInstallments(data);
//       setLoading(false);
//     }

//     load();
//   }, [feeId]);

//   if (loading) return <p className="p-6">Loading installments...</p>;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 p-6">
//       <h1 className="text-xl font-semibold">
//         Installment Payment Status
//       </h1>

//       {installments.map(inst => (
//         <Card key={inst.id} className="p-4">
//           <div className="mb-4">
//             <h2 className="font-medium">{inst.name}</h2>
//             <p className="text-sm text-muted-foreground">
//               Amount: {inst.amount.toLocaleString()} FCFA
//             </p>
//             {inst.dueDate && (
//               <p className="text-sm text-muted-foreground">
//                 Due: {new Date(inst.dueDate).toLocaleDateString()}
//               </p>
//             )}
//           </div>

//           <table className="w-full border">
//             <thead className="bg-muted">
//               <tr>
//                 <th className="p-2 text-left">Student</th>
//                 <th className="p-2 text-left">Code</th>
//                 <th className="p-2 text-left">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {inst.students.map(st => (
//                 <tr key={st.id} className="border-t">
//                   <td className="p-2">
//                     {st.firstName} {st.lastName}
//                   </td>
//                   <td className="p-2">{st.studentCode}</td>
//                   <td className="p-2">
//                     <Badge
//                       variant={st.status === "PAID" ? "default" : "error"}
//                     >
//                       {st.status}
//                     </Badge>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       ))}
//     </div>
//   );
// }


import InstallmentsStatusPage from "./InstallmentsStatusPage";

export default async function Page({
  params,
}: {
  params: Promise<{ feeId: string }>;
}) {
  const { feeId } = await params;

  return <InstallmentsStatusPage feeId={feeId} />;
}
