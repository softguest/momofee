"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ParentOnboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [studentCode, setStudentCode] = useState("");

  async function handleSubmit() {
    const res = await fetch("/api/onboarding/parent", {
      method: "POST",
      body: JSON.stringify({ studentCode }),
    });

    if (res.ok) router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-xl font-semibold">Link Your Child</h1>

        <p className="text-muted-foreground text-sm">
          Enter the student code provided by the school.
        </p>

        <Input
          placeholder="Enter student code"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />

        <Button className="w-full" onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
