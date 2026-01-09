"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { toast } from "sonner";
import WaterLoader from "./loaders/WaterLoader";

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

export default function ProfileComponent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

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

  // 🔹 Sync controlled selects
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
      } catch (error) {
        console.error(error);
      } finally {
        setClassesLoading(false);
      }
    }

    fetchClasses();
  }, []);

  async function submit(formData: FormData) {
    if (profileExists) return;

    setLoading(true);

    try {
      const res = await fetch("/api/student/profile", {
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

      if (!res.ok) {
        throw new Error("Failed to create student profile");
      }

      toast.success("Student profile created successfully 🎉");

      // 🔁 Re-run Dashboard server component
      router.refresh();
    } catch (error) {
      console.error("Profile creation failed:", error);
      toast.error("Failed to create student profile");
    } finally {
      setLoading(false);
    }
  }

  // 🌊 SHOW WATER LOADER WHILE CREATING PROFILE
  if (loading) {
    return <WaterLoader label="Creating student profile..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6">
        <div>Profile Details</div>
        <FiUser />
      </div>

      <section className="bg-primary text-white rounded-md py-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          {profileExists ? "Student Profile" : "Complete Student Profile"}
        </h1>
      </section>

      <form action={submit} className="space-y-4">
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

        <select
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

        <button
          disabled={profileExists || classesLoading}
          className="w-full bg-primary cursor-pointer text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {profileExists ? "Profile Already Created" : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
