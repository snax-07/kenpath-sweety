import { AppShell } from "@/components/app-shell";
import { ReportOverview } from "@/features/reports/components/report-overview";

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Track trends across the day and across the month.">
      <ReportOverview />
    </AppShell>
  );
}
