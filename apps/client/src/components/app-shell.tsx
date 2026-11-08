"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/readings", label: "Readings" },
  { href: "/reports", label: "Reports" },
  { href: "/profile", label: "Profile" },
];

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#06131d] px-3 py-3 text-slate-50 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-[1400px] rounded-[32px] border border-sky-400/20 bg-[#0a1b2a]/95 p-3 shadow-[0_30px_80px_rgba(4,10,18,0.7)] ring-1 ring-white/5 backdrop-blur-xl">
        <header className="mb-8 rounded-[26px] border border-white/10 bg-slate-900/70 px-5 py-4 shadow-[0_18px_42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                S
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80">Kenpath</p>
                <h1 className="text-xl font-semibold text-white">Sweety</h1>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 p-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-[0_10px_20px_rgba(92,168,240,0.3)]"
                        : "text-slate-200 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 self-start rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100 lg:self-auto">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-xs font-bold text-emerald-200">
                PS
              </span>
              Priya S.
            </div>
          </div>
        </header>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Overview</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
          </div>
          {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
        </div>

        {children}
      </div>
    </div>
  );
}
