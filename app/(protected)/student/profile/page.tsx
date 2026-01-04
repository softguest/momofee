// "use client";

// import { useEffect, useState } from "react";
// import { FiUser } from "react-icons/fi";

// type Class = {
//   id: string;
//   name: string;
// };

// type StudentProfile = {
//   firstName: string | null;
//   middleName: string | null;
//   lastName: string | null;
//   age: number | null;
//   gender: string | null;
//   classId: string;
// };

// export default function StudentProfilePage() {
//   const [loading, setLoading] = useState(false);
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [classesLoading, setClassesLoading] = useState(true);

//   const [profileExists, setProfileExists] = useState(false);
//   const [profile, setProfile] = useState<StudentProfile | null>(null);

//   // 🔹 Check if profile exists
//   useEffect(() => {
//     async function checkProfile() {
//       const res = await fetch("/api/student/profile/status");
//       const data = await res.json();

//       if (data.exists) {
//         setProfileExists(true);
//         setProfile(data.student);
//       }
//     }

//     checkProfile();
//   }, []);

//   // 🔹 Fetch classes
//   useEffect(() => {
//     async function fetchClasses() {
//       try {
//         const res = await fetch("/api/student/class/all");
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
//     if (profileExists) return;

//     setLoading(true);

//     const res = await fetch("/api/student/profile", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         firstName: formData.get("firstName"),
//         middleName: formData.get("middleName"),
//         lastName: formData.get("lastName"),
//         age: Number(formData.get("age")),
//         gender: formData.get("gender"),
//         classId: formData.get("classId"),
//       }),
//     });

//     setLoading(false);
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <div className="flex items-center space-x-2 text-2xl font-semibold mb-6"><div>Profile Details</div> <div><FiUser /></div></div>
//       <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
//         <div className="px-6">
//           <h1 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
//             {profileExists ? "Student Profile" : "Complete Student Profile"}
//           </h1>

//           <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           </div>
//         </div>
//       </section>

//       <form action={submit} className="space-y-4 mt-8">

//       <input
//         name="firstName"
//         placeholder="First Name"
//         defaultValue={profile?.firstName ?? ""}
//         disabled={profileExists}
//         required
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
//       />

//       <input
//         name="middleName"
//         placeholder="Middle Name"
//         defaultValue={profile?.middleName ?? ""}
//         disabled={profileExists}
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
//       />

//       <input
//         name="lastName"
//         placeholder="Last Name"
//         defaultValue={profile?.lastName ?? ""}
//         disabled={profileExists}
//         required
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
//       />

//       <input
//         name="age"
//         type="number"
//         defaultValue={profile?.age ?? ""}
//         disabled={profileExists}
//         required
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
//       />

//       <select
//         name="gender"
//         defaultValue={profile?.gender ?? ""}
//         disabled={profileExists}
//         required
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
//       >
//         <option value="">Select Gender</option>
//         <option value="Male">Male</option>
//         <option value="Female">Female</option>
//       </select>

//       <select
//         name="classId"
//         defaultValue={profile?.classId ?? ""}
//         disabled={profileExists || classesLoading}
//         required
//         className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
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
//         disabled={profileExists || loading || classesLoading}
//         className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400"
//       >
//         {profileExists
//           ? "Profile Already Created"
//           : loading
//           ? "Saving..."
//           : "Create Profile"}
//       </button>
//     </form>
//     </div>
    
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";

type Class = {
  id: string;
  name: string;
};

type StudentProfile = {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  age: number | null;
  gender: string | null;
  classId: string;
};

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // ✅ Controlled select state
  const [gender, setGender] = useState("");
  const [classId, setClassId] = useState("");

  // 🔹 Check if profile exists
  useEffect(() => {
    async function checkProfile() {
      const res = await fetch("/api/student/profile/status");
      const data = await res.json();

      if (data.exists) {
        setProfileExists(true);
        setProfile(data.student);
      }
    }

    checkProfile();
  }, []);

  // 🔹 Sync select values when profile loads
  useEffect(() => {
    if (profile) {
      setGender(profile.gender ?? "");
      setClassId(profile.classId ?? "");
    }
  }, [profile]);

  // 🔹 Fetch classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/student/class/all");
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
    if (profileExists) return;

    setLoading(true);

    await fetch("/api/student/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        middleName: formData.get("middleName"),
        lastName: formData.get("lastName"),
        age: Number(formData.get("age")),
        gender,
        classId,
      }),
    });

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6">
        <div>Profile Details</div>
        <FiUser />
      </div>

      <section className="max-w-5xl mx-auto px-4 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {profileExists ? "Student Profile" : "Complete Student Profile"}
          </h1>
        </div>
      </section>

      <form action={submit} className="space-y-4 mt-8">
        <input
          name="firstName"
          placeholder="First Name"
          defaultValue={profile?.firstName ?? ""}
          disabled={profileExists}
          required
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
        />

        <input
          name="middleName"
          placeholder="Middle Name"
          defaultValue={profile?.middleName ?? ""}
          disabled={profileExists}
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          defaultValue={profile?.lastName ?? ""}
          disabled={profileExists}
          required
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
        />

        <input
          name="age"
          type="number"
          defaultValue={profile?.age ?? ""}
          disabled={profileExists}
          required
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
        />

        {/* ✅ Gender (controlled) */}
        <select
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          disabled={profileExists}
          required
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* ✅ Class (controlled) */}
        <select
          name="classId"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          disabled={profileExists || classesLoading}
          required
          className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
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

        {/* <button
          disabled={profileExists || loading || classesLoading}
          className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400"
        >
          {profileExists
            ? "Profile Already Created"
            : loading
            ? "Saving..."
            : "Create Profile"}
        </button> */}

        <button
          disabled={profileExists || loading || classesLoading}
          className="w-full bg-primary text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {/* {loading ? "Creating..." : "Create Student Profile"} */}
          {profileExists
            ? "Profile Already Created"
            : loading
            ? "Saving..."
            : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
