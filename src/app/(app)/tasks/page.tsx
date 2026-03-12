import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusChip } from "@/components/ui/status-chip";
import { mockTasks } from "@/lib/mock/mock-data";

export default function TasksPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Tasks"
        subtitle="Manage daily, weekly, recurring, and optional work."
        action={
          <button className="rounded-lg border border-gold bg-gold/15 px-3 py-2 text-xs font-medium text-gold-strong">
            Create task
          </button>
        }
      />

      <SectionCard title="Task categories" description="Filter controls will be added in Sprint 2.">
        <div className="flex flex-wrap gap-2">
          <StatusChip label="Daily" tone="gold" />
          <StatusChip label="Weekly" />
          <StatusChip label="Recurring" />
          <StatusChip label="Optional" />
        </div>
      </SectionCard>

      <SectionCard title="All tasks" description="Local data placeholder list.">
        <ul className="space-y-2 text-sm">
          {mockTasks.map((task) => (
            <li key={task.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{task.title}</p>
                <StatusChip label={task.priority} tone={task.priority === "critical" ? "warning" : "neutral"} />
              </div>
              <p className="mt-1 text-zinc-300">
                {task.type} · {task.estimatedMinutes} min · {task.status}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
