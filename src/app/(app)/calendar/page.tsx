import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { mockCalendar } from "@/lib/mock/mock-data";

export default function CalendarPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Calendar"
        subtitle="Daily and weekly schedule visibility for fixed and recurring items."
      />

      <SectionCard title="Daily view" description="Simplified day schedule for the MVP.">
        <ul className="space-y-2 text-sm">
          {mockCalendar.daily.map((entry) => (
            <li key={entry.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              {entry.start} - {entry.end} · {entry.title}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Weekly view" description="High-level weekly map (expanded monthly view comes later).">
        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {mockCalendar.weekly.map((day) => (
            <div key={day.day} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <p className="font-medium">{day.day}</p>
              <p className="mt-1 text-zinc-300">{day.summary}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
