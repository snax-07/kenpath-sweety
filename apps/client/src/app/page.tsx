"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HealthDashboard } from "@/components/health-dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("accessToken="));

    setIsLoggedIn(Boolean(cookieValue));
  }, []);

  return (
    <main className="min-h-screen bg-[#06131d] px-3 py-3 text-slate-50 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-[1260px] rounded-[30px] border border-sky-400/20 bg-[#0a1b2a]/95 p-3 shadow-[0_30px_90px_rgba(4,10,18,0.7)] ring-1 ring-white/5 backdrop-blur-xl">
        <header className="mb-6 flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-900/70 px-5 py-4 shadow-[0_16px_26px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-lg font-black text-slate-950">
              &
            </div>
            <div>
              <div className="text-[11px] font-black tracking-[0.22em] text-slate-100">HEALTHO</div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_8px_16px_rgba(34,45,58,0.2)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,_#f7d5cf,_#d8c7d9_38%,_#adacb7_100%)] text-[10px] font-bold text-white">
                  PS
                </span>
                Profile
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-800">
                  Login
                </Link>
                <Link href="/register" className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_20px_rgba(92,168,240,0.2)] transition hover:brightness-110">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </header>

        <HealthDashboard />
      </div>
    </main>
  );
}
