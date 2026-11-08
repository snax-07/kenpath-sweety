"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { loginUser } from "@/features/auth/services/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("priya@kenpath.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const result = await loginUser({ email, password });
    setIsSubmitting(false);

    if (result?.message?.toLowerCase().includes("success") || result?.user) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError(result?.message || "Unable to log in right now.");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue tracking your daily health rhythm."
      footer={
        <p>
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#5ca8f0] transition hover:text-[#3d8ad5]">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-[#5d6978]">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-[#c7d0d8] bg-white" />
            Remember me
          </label>
          <a href="#" className="text-[#5ca8f0] transition hover:text-[#3d8ad5]">
            Forgot password?
          </a>
        </div>

        {error ? <p className="rounded-xl border border-[#f1c2c4] bg-[#fff3f3] px-3 py-2 text-sm text-[#a1474d]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-[16px] bg-[#5ca8f0] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_20px_rgba(92,168,240,0.2)] transition hover:bg-[#4c96e0] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
