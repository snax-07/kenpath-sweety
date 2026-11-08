import { AppShell } from "@/components/app-shell";
import { HealthDashboard } from "@/components/health-dashboard";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Your health overview and daily rhythm at a glance.">
      <HealthDashboard />
    </AppShell>
  );
}
