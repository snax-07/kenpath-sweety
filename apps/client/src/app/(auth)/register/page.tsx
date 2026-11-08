"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { registerUser } from "@/features/auth/services/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "Priya Sharma",
    email: "priya@kenpath.ai",
    password: "password123",
    confirmPassword: "password123",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const result = await registerUser({ name: form.fullName, email: form.email, password: form.password });
    setIsSubmitting(false);

    if (result?.message?.toLowerCase().includes("success") || result?.user) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError(result?.message || "Unable to create account right now.");
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Set up your health profile and start logging readings in minutes."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#5ca8f0] transition hover:text-[#3d8ad5]">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Full name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#46566a]">Confirm password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full rounded-[16px] border border-[#dfe3e7] bg-[#fbfbfa] px-4 py-3 text-[#1d2a39] outline-none transition focus:border-[#5ca8f0]"
          />
        </div>

        {error ? <p className="rounded-xl border border-[#f1c2c4] bg-[#fff3f3] px-3 py-2 text-sm text-[#a1474d]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-[16px] bg-[#5ca8f0] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_20px_rgba(92,168,240,0.2)] transition hover:bg-[#4c96e0] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
