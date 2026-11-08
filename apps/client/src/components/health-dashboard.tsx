"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useReadings } from "@/features/readings/hooks/use-readings";
import { useReports } from "@/features/reports/hooks/use-reports";

const slotLabels: Record<string, string> = {
  MORNING: "Morning",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function formatValue(value: number | undefined) {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "0.0";
  }

  return value.toFixed(1);
}

export function HealthDashboard() {
  const { readings, loading: readingsLoading } = useReadings();
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(toDateInputValue(new Date()));
  }, []);

  const { daily, loading: reportsLoading } = useReports(today);

  const stats = useMemo(() => {
    const safeReadings = readings.length ? readings : daily.readings;
    const values = safeReadings.map((entry) => Number(entry.value ?? 0));

    if (!values.length) {
      return { avg: 0, highest: 0, lowest: 0, count: 0 };
    }

    return {
      avg: values.reduce((sum, value) => sum + value, 0) / values.length,
      highest: Math.max(...values),
      lowest: Math.min(...values),
      count: values.length,
    };
  }, [daily.readings, readings]);

  const chartPoints = useMemo(() => {
    const source = daily.readings.length ? daily.readings : readings;

    if (!source.length) {
      return [0, 0, 0, 0];
    }

    return source.slice(0, 4).map((entry) => Number(entry.value ?? 0));
  }, [daily.readings, readings]);

  const latestReadings = readings.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Average", value: `${formatValue(stats.avg)} mg/dL`, tone: "amber" },
          { label: "Highest", value: `${stats.highest || 0} mg/dL`, tone: "rose" },
          { label: "Lowest", value: `${stats.lowest || 0} mg/dL`, tone: "emerald" },
          { label: "Readings", value: `${stats.count || 0}`, tone: "sky" },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-[24px] border p-5 ${
              card.tone === "amber"
                ? "border-amber-400/30 bg-amber-500/10"
                : card.tone === "rose"
                  ? "border-rose-400/30 bg-rose-500/10"
                  : card.tone === "emerald"
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-sky-400/30 bg-sky-500/10"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{card.label}</p>
            <p className="mt-4 text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Trend</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Daily rhythm</h3>
            </div>
            <span className="text-sm text-slate-300">{daily.periodLabel}</span>
          </div>

          {readingsLoading || reportsLoading ? (
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-300">Loading dashboard…</div>
          ) : chartPoints.length === 0 || !chartPoints.some((point) => point > 0) ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
              No glucose data yet. Add your first reading to bring the dashboard to life.
            </div>
          ) : (
            <div className="flex h-52 items-end gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              {chartPoints.map((point, index) => (
                <div key={`${index}-${point}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-400 via-cyan-400 to-sky-500"
                    style={{ height: `${Math.max(12, (point / Math.max(1, Math.max(...chartPoints))) * 100)}%` }}
                  />
                  <span className="text-xs text-slate-300">{index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300/80">Quick actions</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Stay on track</h3>

          <div className="mt-5 space-y-3">
            <Link href="/readings" className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-left text-white transition hover:border-cyan-400/30 hover:bg-slate-900">
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Add check</span>
                <span className="mt-1 block font-medium">New reading</span>
              </span>
              <span className="text-lg text-cyan-300">→</span>
            </Link>
            <Link href="/reports" className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-left text-white transition hover:border-cyan-400/30 hover:bg-slate-900">
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">See trends</span>
                <span className="mt-1 block font-medium">View reports</span>
              </span>
              <span className="text-lg text-cyan-300">→</span>
            </Link>
            <Link href="/profile" className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-left text-white transition hover:border-cyan-400/30 hover:bg-slate-900">
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Care plan</span>
                <span className="mt-1 block font-medium">Profile overview</span>
              </span>
              <span className="text-lg text-cyan-300">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">Recent</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Latest readings</h3>
          </div>
          <Link href="/readings" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
            Open readings →
          </Link>
        </div>

        <div className="space-y-3">
          {latestReadings.length ? (
            latestReadings.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-3">
                <div>
                  <p className="font-medium text-white">{slotLabels[entry.slot] ?? entry.slot}</p>
                  <p className="text-xs text-slate-400">{entry.readingDate}</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                  {entry.value} mg/dL
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
              Your latest readings will appear here as soon as you log them.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
