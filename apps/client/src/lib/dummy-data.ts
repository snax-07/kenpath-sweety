export type GlucoseSlot =
  | "Morning (fasting)"
  | "After breakfast"
  | "After lunch"
  | "After dinner";

export type ReadingSlotKey =
  | "MORNING"
  | "AFTER_BREAKFAST"
  | "AFTER_LUNCH"
  | "AFTER_DINNER";

export const readingSlotOptions: Array<{ value: ReadingSlotKey; label: GlucoseSlot }> = [
  { value: "MORNING", label: "Morning (fasting)" },
  { value: "AFTER_BREAKFAST", label: "After breakfast" },
  { value: "AFTER_LUNCH", label: "After lunch" },
  { value: "AFTER_DINNER", label: "After dinner" },
];

export const getReadingSlotLabel = (slot: ReadingSlotKey | GlucoseSlot) => {
  if (slot === "MORNING") return "Morning (fasting)";
  if (slot === "AFTER_BREAKFAST") return "After breakfast";
  if (slot === "AFTER_LUNCH") return "After lunch";
  if (slot === "AFTER_DINNER") return "After dinner";
  return slot;
};

export type Reading = {
  id: string;
  date: string;
  slot: GlucoseSlot;
  value: number;
  note?: string;
};

export const profile = {
  name: "Priya Sharma",
  email: "priya@kenpath.ai",
  dob: "1996-04-14",
  goal: "Below 140 mg/dL after meals",
  plan: "Starter Care",
};

export const readings: Reading[] = [
  { id: "r1", date: "2026-11-06", slot: "Morning (fasting)", value: 96, note: "Good start" },
  { id: "r2", date: "2026-11-06", slot: "After breakfast", value: 132, note: "Slightly elevated" },
  { id: "r3", date: "2026-11-06", slot: "After lunch", value: 148, note: "Lunch was heavier" },
  { id: "r4", date: "2026-11-06", slot: "After dinner", value: 127, note: "Steady" },
  { id: "r5", date: "2026-11-05", slot: "Morning (fasting)", value: 92, note: "Stable" },
  { id: "r6", date: "2026-11-05", slot: "After breakfast", value: 138, note: "Coffee + toast" },
  { id: "r7", date: "2026-11-04", slot: "After lunch", value: 150, note: "Post-meal spike" },
  { id: "r8", date: "2026-10-31", slot: "After dinner", value: 121, note: "Normal" },
  { id: "r9", date: "2026-10-30", slot: "Morning (fasting)", value: 88, note: "Great morning" },
  { id: "r10", date: "2026-09-30", slot: "After breakfast", value: 140, note: "Monthly review" },
  { id: "r11", date: "2026-09-22", slot: "After lunch", value: 160, note: "Busy day" },
  { id: "r12", date: "2026-09-12", slot: "After dinner", value: 133, note: "Dinner walk helped" },
];

export const recentReadings = readings.slice(0, 5);

export const reportSummary = {
  average: 124.8,
  highest: 166,
  lowest: 82,
  count: 12,
  periodLabel: "1 Oct – 15 Oct 2026",
};

export const monthlyTrend = [
  { label: "W1", value: 122 },
  { label: "W2", value: 128 },
  { label: "W3", value: 136 },
  { label: "W4", value: 130 },
];

export const reminders = [
  "Morning check-in due at 7:30 AM",
  "After breakfast log recommended",
  "Hydration reminder after lunch",
];
