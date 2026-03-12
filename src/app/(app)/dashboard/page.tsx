import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusChip } from "@/components/ui/status-chip";
import { mockCurrentDay } from "@/lib/mock/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Today"
        subtitle="Your realistic plan, live-adjusted as the day changes."
        action={
          <button className="rounded-lg border border-gold bg-gold/15 px-3 py-2 text-xs font-medium text-gold-strong">
            Rebuild day
          </button>
        }
      />

      <SectionCard title="Now and next" description="Current and upcoming focus blocks.">
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md border border-surface-border bg-surface/70 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Current</p>
            <p className="mt-2 font-medium">{mockCurrentDay.currentTask}</p>
          </div>
          <div className="rounded-md border border-surface-border bg-surface/70 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Next</p>
            <p className="mt-2 font-medium">{mockCurrentDay.nextTask}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Warnings" description="Risk areas detected in your current plan.">
        <div className="flex flex-wrap gap-2">
          {mockCurrentDay.warnings.map((warning) => (
            <StatusChip key={warning} label={warning} tone="warning" />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Timeline" description="Day timeline with realistic constraints.">
        <ul className="space-y-2 text-sm">
          {mockCurrentDay.timeline.map((entry) => (
            <li key={entry.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <p className="font-medium">
                {entry.start} - {entry.end} · {entry.label}
              </p>
              <p className="mt-1 text-zinc-300">{entry.type}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="pb-4">
        <button className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-zinc-200 hover:border-gold/60">
          Add blocker
        </button>
      </div>
    </div>
  );
}
