// "use client";

// import { useEffect, useState } from "react";

// export default function PaymentHistory() {
//   const [payments, setPayments] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("/api/payments/history")
//       .then((res) => res.json())
//       .then(setPayments);
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       <h1 className="text-2xl font-semibold mb-6">Payment History</h1>

//       <div className="overflow-x-auto">
//         <table className="w-full border hidden md:table">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 text-left">Date</th>
//               <th className="text-left">Amount</th>
//               <th className="text-left">Status</th>
//               <th className="text-left">Transaction</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((p) => (
//               <tr key={p.id} className="border-t">
//                 <td className="p-2">
//                   {new Date(p.createdAt).toLocaleDateString()}
//                 </td>
//                 <td>{p.amount.toLocaleString()} XAF</td>
//                 <td>{p.status}</td>
//                 <td>{p.momoTransactionId || "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Mobile card layout */}
//         <div className="md:hidden space-y-4">
//           {payments.map((p) => (
//             <div
//               key={p.id}
//               className="border rounded-lg p-4 shadow-sm bg-white"
//             >
//               <div className="flex justify-between">
//                 <span className="font-medium text-gray-600">Date:</span>
//                 <span>{new Date(p.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium text-gray-600">Amount:</span>
//                 <span>{p.amount.toLocaleString()} XAF</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium text-gray-600">Status:</span>
//                 <span>{p.status}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium text-gray-600">Transaction:</span>
//                 <span>{p.momoTransactionId || "-"}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/payments/history")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6"><div>Payment History</div> <div><FiClock /></div></div>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Student Payment History
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>
      <div className="mt-8">
        <table className="w-full border">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
              <th className="text-left">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t block md:table-row mb-4 md:mb-0"
              >
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Date:{" "}
                  </span>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Amount:{" "}
                  </span>
                  {p.amount.toLocaleString()} XAF
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Status:{" "}
                  </span>
                  {p.status}
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Transaction:{" "}
                  </span>
                  {p.momoTransactionId || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
