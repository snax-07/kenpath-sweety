"use client";

import { useMemo, useState } from "react";
import { useReadings } from "@/features/readings/hooks/use-readings";
import type { ReadingRecord, ReadingSlot } from "@/features/readings/services/readings-api";

const slotLabels: Record<ReadingSlot, string> = {
  MORNING: "Morning (fasting)",
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

const emptyForm = {
  readingDate: toDateInputValue(new Date()),
  slot: "MORNING" as ReadingSlot,
  value: "",
};

export function ReadingBoard() {
  const { readings, loading, error, addReading, editReading, removeReading } = useReadings();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    if (!readings.length) {
      return { avg: "0.0", highest: 0, lowest: 0, count: 0 };
    }

    const values = readings.map((entry) => Number(entry.value ?? 0));
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      avg: avg.toFixed(1),
      highest: Math.max(...values),
      lowest: Math.min(...values),
      count: readings.length,
    };
  }, [readings]);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({ ...emptyForm, readingDate: toDateInputValue(new Date()) });
    setMessage("");
    setIsOpen(true);
  };

  const openEditDialog = (entry: ReadingRecord) => {
    setEditingId(entry.id);
    setForm({
      readingDate: typeof entry.readingDate === "string" ? entry.readingDate.slice(0, 10) : toDateInputValue(new Date()),
      slot: entry.slot,
      value: String(entry.value),
    });
    setMessage("");
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm, readingDate: toDateInputValue(new Date()) });
    setMessage("");
  };

  const validate = (rawDate: string, rawSlot: ReadingSlot, rawValue: string) => {
    const nextValue = Number(rawValue);
    const selectedDate = rawDate ? new Date(`${rawDate}T00:00:00`) : null;

    if (!rawDate) return "Please choose a date.";
    if (selectedDate && selectedDate > new Date()) return "Date cannot be in the future.";
    if (!Number.isFinite(nextValue) || nextValue < 40 || nextValue > 600) return "Value must be between 40 and 600 mg/dL.";

    const sameDayEntries = readings.filter((entry) => entry.readingDate.slice(0, 10) === rawDate);
    if (sameDayEntries.length >= 4 && !editingId) return "You can add only 4 readings per day.";
    if (sameDayEntries.some((entry) => entry.slot === rawSlot && entry.id !== editingId)) {
      return `You already have a ${slotLabels[rawSlot]} reading for this date.`;
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validate(form.readingDate, form.slot, form.value);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    const payload = {
      readingDate: form.readingDate,
      slot: form.slot,
      value: Number(form.value),
    };

    const result = editingId ? await editReading(editingId, payload) : await addReading(payload);
    if (result) {
      closeDialog();
      setMessage(editingId ? "Reading updated successfully." : "Reading saved successfully.");
      return;
    }

    setMessage("The reading service is unavailable right now.");
  };

  const handleDelete = async (id: string) => {
    await removeReading(id);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1.6fr]">
      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Quick add</p>
            <h3 className="mt-2 text-xl font-semibold text-white">New glucose entry</h3>
          </div>
          <button
            type="button"
            onClick={openCreateDialog}
            className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20"
          >
            + Add entry
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-300">Loading readings…</div>
          ) : error && !readings.length ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">{error}</div>
          ) : readings.length ? (
            readings.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-3">
                <div>
                  <p className="font-medium text-white">{slotLabels[entry.slot]}</p>
                  <p className="text-xs text-slate-400">{entry.readingDate.slice(0, 10)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                    {entry.value} mg/dL
                  </span>
                  <button type="button" onClick={() => openEditDialog(entry)} className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-200">
                    Edit
                  </button>
                  <button type="button" onClick={() => void handleDelete(entry.id)} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-200">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-sm text-slate-300">
              No readings yet. Add your first glucose check to get started.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Summary</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Today&apos;s overview</h3>
          </div>
          <span className="text-sm text-slate-300">{stats.count} entries</span>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Avg</p>
            <p className="mt-3 text-2xl font-bold text-white">{stats.avg} mg/dL</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-red-200">High</p>
            <p className="mt-3 text-2xl font-bold text-white">{stats.highest} mg/dL</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Low</p>
            <p className="mt-3 text-2xl font-bold text-white">{stats.lowest} mg/dL</p>
          </div>
        </div>

        {message ? <p className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p> : null}

        <div className="space-y-3">
          {readings.length ? (
            readings.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-3">
                <div>
                  <p className="font-medium text-white">{slotLabels[entry.slot]}</p>
                  <p className="text-xs text-slate-400">{new Date(entry.readingDate).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                  {entry.value} mg/dL
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
              No readings available for this period.
            </div>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.55)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">{editingId ? "Edit reading" : "Add reading"}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{editingId ? "Update glucose entry" : "New glucose entry"}</h3>
              </div>
              <button type="button" onClick={closeDialog} className="rounded-full border border-white/10 px-2 py-1 text-sm text-slate-300">Close</button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Date</span>
                <input
                  type="date"
                  value={form.readingDate}
                  onChange={(event) => setForm((current) => ({ ...current, readingDate: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Time slot</span>
                <select
                  value={form.slot}
                  onChange={(event) => setForm((current) => ({ ...current, slot: event.target.value as ReadingSlot }))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                >
                  {Object.entries(slotLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Value (mg/dL)</span>
                <input
                  type="number"
                  min={40}
                  max={600}
                  value={form.value}
                  onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
                  placeholder="e.g. 118"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                />
              </label>

              {message ? <p className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p> : null}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeDialog} className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200">Cancel</button>
                <button type="submit" className="rounded-2xl bg-[#5ca8f0] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(92,168,240,0.2)]">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
