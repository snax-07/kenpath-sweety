import { AppShell } from "@/components/app-shell";
import { profile } from "@/lib/dummy-data";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Your personal care snapshot and preferences.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xl font-bold text-slate-950">
              PS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Member</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{profile.name}</h3>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Email</span>
              <span className="mt-2 block text-base text-white">{profile.email}</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Plan</span>
              <span className="mt-2 block text-base text-white">{profile.plan}</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Care goal</span>
              <span className="mt-2 block text-base text-white">{profile.goal}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Preferences</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Care summary</h3>

          <div className="mt-6 space-y-4">
            {[
              { label: "Preferred notification window", value: "7:00 AM – 9:00 PM" },
              { label: "Best reminder cadence", value: "Before breakfast and after dinner" },
              { label: "Latest log entry", value: "2026-11-06 • After dinner" },
              { label: "Tracking commitment", value: "4 checks each day" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-base font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
