"use client";

import { useState, useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";



export default function Page() {
  const [mode, setMode] = useState<"login" | "signup" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

   useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  const handleGoogle = async () => {
    if (!signIn) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const res = await signIn?.create({ identifier: email, password });
        if (res?.status === "complete") {
          // setActiveSignIn may be undefined depending on the Clerk hook return type,
          // so guard the call with optional chaining to avoid invoking undefined.
          await setActiveSignIn?.({ session: res.createdSessionId });
          location.href = "/dashboard";
        }
      }

      if (mode === "signup") {
        const res = await signUp?.create({ emailAddress: email, password });
        await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
        setMode("verify");
      }

      if (mode === "verify") {
        const res = await signUp?.attemptEmailAddressVerification({ code });
        if (res?.status === "complete") {
          await setActiveSignUp?.({ session: res.createdSessionId });
          location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-slate-100 to-red-200 text-slate-900 overflow-hidden">
      {/* <ThreeBackground /> */}
      <div className="flex grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex items-center justify-center bg-primary text-white p-10 space-x-2">
          {/* Right side can be used for additional graphics or left empty */}
          <div className="h-8 w-8 bg-accent rounded-full mb-4" />
          <h1 className="text-4xl font-extrabold mb-4">SubjectSpot Fee</h1>
        </div>
        <div className="">
          <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div
              className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-2xl"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">
                  {mode === "login" && "Welcome Back"}
                  {mode === "signup" && "Create Account with"}
                  {mode === "verify" && "Verify Email"}
                </h1>
                <h1 className="text-2xl font-bold text-accent">SubjectSpot Fee</h1>
                <p className="mt-2 text-sm text-slate-600">
                  {mode === "verify"
                    ? "Enter the verification code sent to your email"
                    : "Secure access to your dashboard"}
                </p>
              </div>

              <div className="space-y-4">
                {mode !== "verify" && (
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                )}

                {mode !== "verify" && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                )}

                {mode === "verify" && (
                  <input
                    type="text"
                    placeholder="Verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                )}

                {error && (
                  <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleSubmit}
                  className="w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : mode === "signup"
                    ? "Create Account"
                    : "Verify Email"}
                </Button>

                {mode !== "verify" && (
                  <button
                    onClick={handleGoogle}
                    className="w-full rounded-xl border bg-white py-3 font-medium shadow hover:bg-slate-50"
                  >
                    Continue with Google 
                  </button>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-slate-600">
                {mode === "login" && (
                  <button onClick={() => setMode("signup")} className="text-indigo-600 hover:underline">
                    Don’t have an account? Sign up
                  </button>
                )}
                {mode === "signup" && (
                  <button onClick={() => setMode("login")} className="text-indigo-600 hover:underline">
                    Already have an account? Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
