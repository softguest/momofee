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

  // async function submit(formData: FormData) {
  //   if (profileExists) return;

  //   setLoading(true);

  //   await fetch("/api/student/profile", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       firstName: formData.get("firstName"),
  //       middleName: formData.get("middleName"),
  //       lastName: formData.get("lastName"),
  //       age: Number(formData.get("age")),
  //       gender,
  //       classId,
  //     }),
  //   });

  //   setLoading(false);
  // }

  async function submit(formData: FormData) {
  setLoading(true);

  const payload = {
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    lastName: formData.get("lastName"),
    age: Number(formData.get("age")),
    gender,
    classId: hasClassSelected ? profile?.classId : classId,
  };

  await fetch("/api/student/profile", {
    method: profileExists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  setLoading(false);
}


  const hasClassSelected = Boolean(profile?.classId);


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
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="middleName"
          placeholder="Middle Name"
          defaultValue={profile?.middleName ?? ""}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          defaultValue={profile?.lastName ?? ""}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="age"
          type="number"
          defaultValue={profile?.age ?? ""}
          required
          className="w-full border px-3 py-2 rounded"
        />

        {/* ✅ Gender (controlled) */}
        <select
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
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
          disabled={hasClassSelected || classesLoading}
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

        {hasClassSelected && (
          <p className="text-sm text-gray-500">
            Class cannot be changed once selected.
          </p>
        )}


        <button
          disabled={loading || classesLoading}
          className="w-full bg-primary text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : profileExists
            ? "Update Profile"
            : "Create Profile"}
        </button>

      </form>
    </div>
  );
}
