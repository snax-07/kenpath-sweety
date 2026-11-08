"use client";

import { useEffect, useState } from "react";
import { useReports } from "@/features/reports/hooks/use-reports";

const formatNumber = (value: number) => Number.isFinite(value) ? value.toFixed(1) : "0.0";
const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function ReportOverview() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const today = toDateInputValue(new Date());
    setStartDate(today);
    setEndDate(today);
    setMaxDate(today);
  }, []);

  const { range, daily, monthToDate, previousMonth, loading } = useReports(startDate, endDate);
  const activeReport = range.count > 0 || (startDate && endDate && startDate !== endDate) ? range : daily;

  const cards = [
    { label: "Average", value: `${formatNumber(activeReport.average)} mg/dL`, tone: "amber" },
    { label: "Highest", value: `${formatNumber(activeReport.highest)} mg/dL`, tone: "rose" },
    { label: "Lowest", value: `${formatNumber(activeReport.lowest)} mg/dL`, tone: "emerald" },
    { label: "Readings", value: `${activeReport.count}`, tone: "sky" },
  ];

  const trendData = activeReport.readings.length
    ? activeReport.readings.slice(-7).map((entry, index) => {
        const labelSource = entry.readingDate ?? "";
        const label = labelSource
          ? new Date(`${labelSource}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `#${index + 1}`;

        return {
          label,
          value: Number(entry.value ?? 0),
        };
      })
    : [
        { label: "Day 1", value: 0 },
        { label: "Day 2", value: 0 },
        { label: "Day 3", value: 0 },
        { label: "Day 4", value: 0 },
      ];

  const maxTrendValue = Math.max(...trendData.map((point) => point.value), 1);
  const showEmpty = !loading && activeReport.count === 0;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Reporting period</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Select a custom date range</h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200">
              <span className="text-slate-300">From</span>
              <input
                type="date"
                value={startDate}
                max={maxDate || undefined}
                onChange={(event) => setStartDate(event.target.value || maxDate || "")}
                className="rounded-xl border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white outline-none ring-0 transition focus:border-cyan-400/50"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200">
              <span className="text-slate-300">To</span>
              <input
                type="date"
                value={endDate}
                max={maxDate || undefined}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value || startDate || "")}
                className="rounded-xl border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white outline-none ring-0 transition focus:border-cyan-400/50"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
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

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Trend</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Daily rhythm</h3>
            </div>
            <span className="text-sm text-slate-300">{activeReport.periodLabel}</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-300">Loading reports…</div>
          ) : showEmpty ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
              There are no readings yet for this selected day. Add your first reading to see the trend.
            </div>
          ) : (
            <div className="flex h-52 items-end gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              {trendData.map((point, index) => (
                <div key={`${point.label}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-400 via-cyan-400 to-sky-500"
                    style={{ height: `${Math.max(8, (point.value / maxTrendValue) * 100)}%` }}
                  />
                  <span className="text-[10px] text-slate-300">{point.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300/80">Insight</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Healthy pattern</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Current average</span>
              <span className="mt-2 block text-lg font-semibold text-white">{formatNumber(activeReport.average)} mg/dL</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Month to date</span>
              <span className="mt-2 block text-lg font-semibold text-white">{formatNumber(monthToDate.average)} mg/dL</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Previous month</span>
              <span className="mt-2 block text-lg font-semibold text-white">{formatNumber(previousMonth.average)} mg/dL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
