import { apiRequest } from "@/lib/api";

export type ReportRecord = {
  id?: string;
  readingDate?: string;
  value?: number;
  slot?: string;
};

export type ReportSummary = {
  average: number;
  highest: number;
  lowest: number;
  count: number;
  readings: ReportRecord[];
  periodLabel: string;
};

const emptyReport = (periodLabel = "No data available") => ({
  average: 0,
  highest: 0,
  lowest: 0,
  count: 0,
  readings: [],
  periodLabel,
});

const normalizeSummary = (payload: unknown, fallbackLabel: string): ReportSummary => {
  if (payload && typeof payload === "object") {
    const report = payload as {
      data?: unknown;
      summary?: unknown;
      average?: number;
      highest?: number;
      lowest?: number;
      count?: number;
      readings?: ReportRecord[];
      periodLabel?: string;
    };

    const source = (report.data ?? report.summary ?? report) as {
      average?: number;
      highest?: number;
      lowest?: number;
      count?: number;
      readings?: ReportRecord[];
      periodLabel?: string;
    };

    if (source && typeof source === "object") {
      return {
        average: Number(source.average ?? 0),
        highest: Number(source.highest ?? 0),
        lowest: Number(source.lowest ?? 0),
        count: Number(source.count ?? 0),
        readings: Array.isArray(source.readings) ? source.readings : [],
        periodLabel: source.periodLabel ?? fallbackLabel,
      };
    }
  }

  return emptyReport(fallbackLabel);
};

export async function getDailyReport(date: string) {
  try {
    const result = await apiRequest<unknown>(`/reports/daily?date=${encodeURIComponent(date)}`);
    return normalizeSummary(result, `Daily report • ${date}`);
  } catch {
    return emptyReport(`Daily report • ${date}`);
  }
}

export async function getMonthToDateReport(date: string) {
  try {
    const result = await apiRequest<unknown>(`/reports/month-to-date?date=${encodeURIComponent(date)}`);
    return normalizeSummary(result, `Month to date • ${date}`);
  } catch {
    return emptyReport(`Month to date • ${date}`);
  }
}

export async function getPreviousMonthReport(date: string) {
  try {
    const result = await apiRequest<unknown>(`/reports/monthly?date=${encodeURIComponent(date)}`);
    return normalizeSummary(result, `Previous month • ${date}`);
  } catch {
    return emptyReport(`Previous month • ${date}`);
  }
}

export async function getRangeReport(startDate: string, endDate: string) {
  try {
    const result = await apiRequest<unknown>(`/reports/range?from=${encodeURIComponent(startDate)}&to=${encodeURIComponent(endDate)}`);
    return normalizeSummary(result, `${startDate} – ${endDate}`);
  } catch {
    return emptyReport(`${startDate} – ${endDate}`);
  }
}
