import { AppShell } from "@/components/app-shell";
import { ReadingBoard } from "@/features/readings/components/reading-board";

export default function ReadingsPage() {
  return (
    <AppShell title="Readings" subtitle="Add, review and manage your glucose logs with confidence.">
      <ReadingBoard />
    </AppShell>
  );
}
