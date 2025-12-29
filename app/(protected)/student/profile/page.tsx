"use client";

import { useEffect, useState } from "react";

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

    setLoading(false);
  }

  return (
    <form action={submit} className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">
        {profileExists ? "Student Profile" : "Complete Student Profile"}
      </h1>

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

      <select
        name="gender"
        defaultValue={profile?.gender ?? ""}
        disabled={profileExists}
        required
        className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        name="classId"
        defaultValue={profile?.classId ?? ""}
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

      <button
        disabled={profileExists || loading || classesLoading}
        className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400"
      >
        {profileExists
          ? "Profile Already Created"
          : loading
          ? "Saving..."
          : "Create Profile"}
      </button>
    </form>
  );
}
