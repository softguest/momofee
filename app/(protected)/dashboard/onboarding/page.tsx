"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="text-muted-foreground">
          Choose how you want to use the app.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => router.push("/onboarding/parent")}
          >
            I am a Parent
          </Button>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => router.push("/onboarding/student")}
          >
            I am a Student
          </Button>
        </div>
      </div>
    </div>
  );
}
