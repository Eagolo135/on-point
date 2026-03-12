"use client";

import { useMemo } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { usePlanner } from "@/features/planner/planner-context";

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

function buildMonthGrid(now: Date): Date[] {
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const days: Date[] = [];
  for (let index = 0; index < 42; index += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    days.push(day);
  }
  return days;
}

export default function CalendarPage() {
  const { events } = usePlanner();

  const now = new Date();
  const grid = buildMonthGrid(now);

  const mergedEvents = useMemo(() => {
    const local = events.map((event) => ({
      id: event.id,
      title: event.title,
      startIso: event.startIso,
      endIso: event.endIso,
      source: "local" as const,
    }));

    return local.sort(
      (a, b) => new Date(a.startIso).getTime() - new Date(b.startIso).getTime(),
    );
  }, [events]);

  const grouped = new Map<string, typeof mergedEvents>();
  for (const event of mergedEvents) {
    const key = dayKey(new Date(event.startIso));
    const prev = grouped.get(key) ?? [];
    grouped.set(key, [...prev, event]);
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Calendar"
        subtitle="Visual monthly calendar with local planner items."
      />

      <SectionCard title="Month view" description="Tap any date's tasks from the Tasks or AI chat, and they appear here.">
        <div className="grid grid-cols-7 gap-2 text-xs text-zinc-300">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
            <p key={weekday} className="px-1 py-1.5 text-center font-medium uppercase tracking-wide text-gold">
              {weekday}
            </p>
          ))}

          {grid.map((date) => {
            const key = dayKey(date);
            const dayEvents = grouped.get(key) ?? [];
            const inMonth = date.getMonth() === now.getMonth();

            return (
              <div
                key={key}
                className={`min-h-[92px] rounded-md border p-1.5 ${
                  inMonth
                    ? "border-surface-border bg-surface/70"
                    : "border-surface-border/50 bg-surface/35 text-zinc-500"
                }`}
              >
                <p className="mb-1 px-1 text-[11px]">{date.getDate()}</p>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <p key={event.id} className="truncate rounded border border-gold/40 bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold-strong">
                      {new Date(event.startIso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {event.title}
                    </p>
                  ))}
                  {dayEvents.length > 2 ? <p className="px-1 text-[10px] text-zinc-400">+{dayEvents.length - 2} more</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Upcoming" description="Next activities in chronological order.">
        <div className="space-y-2 text-sm">
          {[...mergedEvents]
            .slice(0, 8)
            .map((event) => (
              <div key={event.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{event.title}</p>
                  <span className="rounded-full border border-surface-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300">
                    {event.source}
                  </span>
                </div>
                <p className="mt-1 text-zinc-300">
                  {new Date(event.startIso).toLocaleString()} - {new Date(event.endIso).toLocaleTimeString()}
                </p>
              </div>
            ))}
          {!mergedEvents.length ? (
            <div className="rounded-md border border-surface-border bg-surface/55 p-3 text-zinc-400">
              No activities yet. Add tasks or ask AI to schedule one.
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
