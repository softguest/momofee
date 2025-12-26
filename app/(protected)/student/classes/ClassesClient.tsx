// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type ClassItem = {
//   id: string;
//   name: string;
//   description: string | null;
//   academicYear: string;
//   createdAt: string;
// };

// export default function ClassesClient() {
//   const [classes, setClasses] = useState<ClassItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/admin/classes")
//       .then((res) => res.json())
//       .then((data) => {
//         setClasses(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto py-10">
//         <p className="text-gray-500">Loading classes...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto py-10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Classes</h1>

//         <Link
//           href="/admin/classes/new"
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           + New Class
//         </Link>
//       </div>

//       {/* Empty State */}
//       {classes.length === 0 && (
//         <div className="border rounded p-6 text-center text-gray-500">
//           No classes created yet.
//         </div>
//       )}

//       {/* Classes Table */}
//       {classes.length > 0 && (
//         <table className="w-full border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left">Name</th>
//               <th>Academic Year</th>
//               <th>Description</th>
//               <th></th>
//             </tr>
//           </thead>

//           <tbody>
//             {classes.map((cls) => (
//               <tr key={cls.id} className="border-t">
//                 <td className="p-2 font-medium">{cls.name}</td>
//                 <td>{cls.academicYear}</td>
//                 <td className="text-gray-600">
//                   {cls.description || "—"}
//                 </td>
//                 <td className="text-right pr-3">
//                   <Link
//                     href={`/admin/classes/${cls.id}`}
//                     className="text-blue-600"
//                   >
//                     View
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

type StudentClass = {
  id: string;
  name: string;
  description: string | null;
  academicYear: string;
  createdAt: string;
};

export default function StudentClassClient() {
  const [cls, setCls] = useState<StudentClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/class")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load class");
        }
        return res.json();
      })
      .then((data) => {
        setCls(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-gray-500">
        Loading your class...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!cls) return null;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">My Class</h1>

      <div className="border rounded-lg p-6 bg-white">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Class Name</p>
          <p className="text-lg font-medium">{cls.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Academic Year</p>
          <p>{cls.academicYear}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-gray-700">
            {cls.description || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
