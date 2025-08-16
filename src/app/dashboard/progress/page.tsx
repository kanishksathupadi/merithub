import { ProgressView } from "@/components/dashboard/progress-view";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground">Visualize your journey and celebrate your achievements.</p>
      </header>
      <ProgressView />
    </div>
  );
}
