"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function StudentOnboarding() {
  const router = useRouter();
  const { user } = useUser();

  async function handleContinue() {
    await fetch("/api/onboarding/student", { method: "POST" });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-xl font-semibold">Student Setup</h1>
        <p className="text-muted-foreground text-sm">
          We will link your student profile automatically.
        </p>

        <Button className="w-full" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
