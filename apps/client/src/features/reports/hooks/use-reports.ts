"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { listReadings, type ReadingRecord } from "@/features/readings/services/readings-api";
import { getDailyReport, getMonthToDateReport, getPreviousMonthReport, getRangeReport, type ReportSummary } from "@/features/reports/services/reports-api";

const emptySummary = (): ReportSummary => ({
  average: 0,
  highest: 0,
  lowest: 0,
  count: 0,
  readings: [],
  periodLabel: "No data available",
});

const buildSummaryFromReadings = (readings: ReadingRecord[], periodLabel: string): ReportSummary => {
  const values = readings.map((entry) => Number(entry.value ?? 0)).filter((value) => Number.isFinite(value));
  const count = values.length;

  return {
    average: count ? Number((values.reduce((sum, value) => sum + value, 0) / count).toFixed(1)) : 0,
    highest: count ? Math.max(...values) : 0,
    lowest: count ? Math.min(...values) : 0,
    count,
    readings: readings.map((entry) => ({
      id: entry.id,
      value: Number(entry.value ?? 0),
      slot: entry.slot,
      readingDate: entry.readingDate,
    })),
    periodLabel,
  };
};

export function useReports(startDate: string, endDate?: string) {
  const normalizedStartDate = startDate || "";
  const normalizedEndDate = endDate || startDate || "";

  const rangedReadings = useQuery({
    queryKey: ["readings", "all"],
    queryFn: () => listReadings(),
    staleTime: 30_000,
    enabled: Boolean(normalizedStartDate),
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: ["reports", "daily", normalizedStartDate],
        queryFn: () => getDailyReport(normalizedStartDate),
        enabled: Boolean(normalizedStartDate),
        staleTime: 30_000,
      },
      {
        queryKey: ["reports", "month-to-date", normalizedStartDate],
        queryFn: () => getMonthToDateReport(normalizedStartDate),
        enabled: Boolean(normalizedStartDate),
        staleTime: 30_000,
      },
      {
        queryKey: ["reports", "previous-month", normalizedStartDate],
        queryFn: () => getPreviousMonthReport(normalizedStartDate),
        enabled: Boolean(normalizedStartDate),
        staleTime: 30_000,
      },
      {
        queryKey: ["reports", "range", normalizedStartDate, normalizedEndDate],
        queryFn: () => getRangeReport(normalizedStartDate, normalizedEndDate),
        enabled: Boolean(normalizedStartDate && normalizedEndDate),
        staleTime: 30_000,
      },
    ],
  });

  const [dailyQuery, monthToDateQuery, previousMonthQuery, rangeQuery] = queries;

  const daily = dailyQuery.data ?? emptySummary();
  const monthToDate = monthToDateQuery.data ?? emptySummary();
  const previousMonth = previousMonthQuery.data ?? emptySummary();
  const range = rangeQuery.data ?? emptySummary();

  let rangeFallback = range;
  if (rangedReadings.data && normalizedStartDate && normalizedEndDate) {
    const start = new Date(`${normalizedStartDate}T00:00:00`);
    const end = new Date(`${normalizedEndDate}T23:59:59`);
    const filtered = rangedReadings.data.filter((entry) => {
      const valueDate = new Date(`${entry.readingDate.slice(0, 10)}T00:00:00`);
      return valueDate >= start && valueDate <= end;
    });

    if (filtered.length || (normalizedStartDate !== normalizedEndDate && rangedReadings.data.length > 0)) {
      rangeFallback = buildSummaryFromReadings(filtered, `${normalizedStartDate} – ${normalizedEndDate}`);
    }
  }

  const rangeSummary = range.count > 0 ? range : rangeFallback;

  return {
    daily,
    monthToDate,
    previousMonth,
    range: rangeSummary,
    loading: dailyQuery.isLoading || monthToDateQuery.isLoading || previousMonthQuery.isLoading || rangeQuery.isLoading || rangedReadings.isLoading,
    error: dailyQuery.error ?? monthToDateQuery.error ?? previousMonthQuery.error ?? rangeQuery.error ?? rangedReadings.error ?? null,
  };
}
