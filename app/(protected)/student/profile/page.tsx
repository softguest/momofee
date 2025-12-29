// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Class = {
//   id: string;
//   name: string;
// };

// export default function StudentProfilePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [classesLoading, setClassesLoading] = useState(true);

//   // ✅ Check if profile already exists
//   useEffect(() => {
//     async function checkProfile() {
//       const res = await fetch("/api/student/profile/status");
//       const data = await res.json();

//       if (data.exists) {
//         router.push("/dashboard");
//       }
//     }

//     checkProfile();
//   }, [router]);

//   // ✅ Fetch classes
//   useEffect(() => {
//     async function fetchClasses() {
//       try {
//         const res = await fetch("/api/student/class");
//         const data = await res.json();
//         setClasses(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setClassesLoading(false);
//       }
//     }

//     fetchClasses();
//   }, []);

//   async function submit(formData: FormData) {
//     setLoading(true);

//     const res = await fetch("/api/student/profile", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         classId: formData.get("classId"),
//       }),
//     });

//     if (res.ok) {
//       router.push("/dashboard");
//     }

//     setLoading(false);
//   }

//   return (
//     <form action={submit} className="max-w-xl mx-auto space-y-4">
//       <h1 className="text-2xl font-semibold">Complete Student Profile</h1>

//       <select
//         name="classId"
//         required
//         disabled={classesLoading}
//         className="w-full border rounded px-3 py-2"
//       >
//         <option value="">
//           {classesLoading ? "Loading classes..." : "Select Class"}
//         </option>

//         {classes.map((cls) => (
//           <option key={cls.id} value={cls.id}>
//             {cls.name}
//           </option>
//         ))}
//       </select>

//       <button
//         disabled={loading || classesLoading}
//         className="px-4 py-2 bg-black text-white rounded"
//       >
//         {loading ? "Saving..." : "Create Profile"}
//       </button>
//     </form>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Class = {
  id: string;
  name: string;
};

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  // 🔹 Check if student profile already exists
  useEffect(() => {
    async function checkProfile() {
      const res = await fetch("/api/student/profile/status");
      const data = await res.json();

      if (data.exists) {
        router.push("/dashboard");
      }
    }
    checkProfile();
  }, [router]);

  // 🔹 Fetch classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/student/class");
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setClassesLoading(false);
      }
    }

    fetchClasses();
  }, []);

  async function submit(formData: FormData) {
    setLoading(true);

    const res = await fetch("/api/student/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        middleName: formData.get("middleName"),
        lastName: formData.get("lastName"),
        age: Number(formData.get("age")),
        gender: formData.get("gender"),
        classId: formData.get("classId"),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <form action={submit} className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Complete Student Profile</h1>

      <input
        name="firstName"
        placeholder="First Name"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="middleName"
        placeholder="Middle Name (optional)"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="lastName"
        placeholder="Last Name"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="age"
        type="number"
        min={1}
        placeholder="Age"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="gender"
        required
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        name="classId"
        required
        disabled={classesLoading}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">
          {classesLoading ? "Loading classes..." : "Select Class"}
        </option>

        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      <button
        disabled={loading || classesLoading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Saving..." : "Create Profile"}
      </button>
    </form>
  );
}
