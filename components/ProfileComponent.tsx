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

      <form action={submit} className="space-y-6 my-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                name="firstName"
                defaultValue={profile?.firstName ?? ""}
                disabled={profileExists}
                required
                className="w-full bg-white border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>

            {/* Middle Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                name="middleName"
                defaultValue={profile?.middleName ?? ""}
                disabled={profileExists}
                className="w-full border bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                name="age"
                type="number"
                defaultValue={profile?.age ?? ""}
                disabled={profileExists}
                required
                className="w-full border bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                name="lastName"
                defaultValue={profile?.lastName ?? ""}
                disabled={profileExists}
                required
                className="w-full border bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={profileExists}
                required
                className="w-full border bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Class */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={profileExists || classesLoading}
                required
                className="w-full border bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
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
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={profileExists || classesLoading}
          className="w-full bg-primary text-white px-4 py-3 rounded-md font-medium hover:opacity-90 transition disabled:bg-gray-400"
        >
          {profileExists ? "Profile Already Created" : "Create Profile"}
        </button>
      </form>

    </div>
  );
}
