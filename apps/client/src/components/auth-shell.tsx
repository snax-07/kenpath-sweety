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

type AuthShellProps = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#06131d] px-4 py-8 text-slate-50 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[30px] border border-sky-400/20 bg-[#0b1b2a]/95 shadow-[0_28px_80px_rgba(4,10,18,0.7)] ring-1 ring-white/5 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-slate-900/70 px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/60 p-1.5">
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
        </div>

        <div className="flex">
          <div className="hidden w-[46%] bg-[radial-gradient(circle_at_top,_rgba(92,168,240,0.16),_transparent_34%),linear-gradient(180deg,_#122b3d_0%,_#0c1724_100%)] p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-9 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-xl font-black text-slate-950 shadow-[0_8px_18px_rgba(92,168,240,0.22)]">
                  &
                </div>
                <div className="text-[13px] font-black tracking-[0.26em] text-slate-100">HEALTHO</div>
              </div>

              <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] text-sky-200/80">Healthy rhythm</p>
              <h1 className="max-w-sm text-[42px] font-semibold leading-[1.02] tracking-[-0.06em] text-white">
                Keep every check clear, calm and consistent.
              </h1>
            </div>

            <div className="space-y-4">
              {[
                "Track four key readings each day",
                "Stay on top of your weekly trends",
                "Review patterns with beautiful summaries",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-slate-900/50 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-200">
                    ✓
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-[54%] lg:p-10">
            <div className="w-full max-w-[420px]">
              <div className="mb-8 text-center lg:text-left">
                <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-100">
                  Member access
                </span>
                <h2 className="mt-4 text-[40px] leading-none tracking-[-0.06em] text-white">{title}</h2>
                <p className="mt-3 text-sm text-slate-300">{subtitle}</p>
              </div>

              {children}

              <div className="mt-6 text-center text-sm text-slate-300">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
