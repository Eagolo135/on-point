"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusChip } from "@/components/ui/status-chip";
import { mockCurrentDay, mockProfile } from "@/lib/mock/mock-data";
import { rebuildDayPlan } from "@/lib/scheduler/rebuild-day-plan";
import { getFreeTimeSuggestions } from "@/lib/suggestions/free-time-suggestions";
import type { BlockerType, ScheduleChangeSummary } from "@/types/domain";

type BlockerForm = {
  title: string;
  type: BlockerType;
  lostMinutes: number;
};

const BLOCKER_TYPES: BlockerType[] = [
  "overslept",
  "unexpected-call",
  "travel-delay",
  "emotional-exhaustion",
  "family-interruption",
  "last-minute-meeting",
  "technical-issue",
  "illness-burnout",
  "other",
];

export function DashboardClient() {
  const [dayPlan, setDayPlan] = useState(mockCurrentDay);
  const [summary, setSummary] = useState<ScheduleChangeSummary | null>(null);
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [customOverrun, setCustomOverrun] = useState(45);
  const [blocker, setBlocker] = useState<BlockerForm>({
    title: "Unexpected blocker",
    type: "other",
    lostMinutes: 30,
  });

  const suggestions = useMemo(() => getFreeTimeSuggestions(dayPlan, mockProfile), [dayPlan]);

  function applyOverrun(minutes: number, moveRemaining = false) {
    if (minutes <= 0 && !moveRemaining) {
      setSummary({
        moved: [],
        shortened: [],
        sacrificed: [],
        warnings: dayPlan.warnings,
        notes: ["Current task marked complete with no extra time added."],
      });
      return;
    }

    const rebuilt = rebuildDayPlan(dayPlan, {
      overrunMinutes: Math.max(0, minutes),
      moveRemaining,
    });

    setDayPlan(rebuilt.plan);
    setSummary(rebuilt.summary);
  }

  function applyBlocker() {
    const rebuilt = rebuildDayPlan(dayPlan, {
      blocker: {
        title: blocker.title,
        type: blocker.type,
        lostMinutes: blocker.lostMinutes,
      },
    });

    setDayPlan(rebuilt.plan);
    setSummary(rebuilt.summary);
    setShowBlockerModal(false);
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Today"
        subtitle="Your realistic plan, live-adjusted as the day changes."
        action={
          <button
            onClick={() => setSummary({ moved: [], shortened: [], sacrificed: [], warnings: [], notes: ["Manual rebuild requested. No conflicting events found."] })}
            className="rounded-lg border border-gold bg-gold/15 px-3 py-2 text-xs font-medium text-gold-strong"
          >
            Rebuild day
          </button>
        }
      />

      <SectionCard title="Now and next" description="Current and upcoming focus blocks.">
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md border border-surface-border bg-surface/70 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Current</p>
            <p className="mt-2 font-medium">{dayPlan.currentTask}</p>
          </div>
          <div className="rounded-md border border-surface-border bg-surface/70 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Next</p>
            <p className="mt-2 font-medium">{dayPlan.nextTask}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Task extension" description="When estimate runs out, choose the right recovery action.">
        <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-md border border-surface-border bg-surface/70 px-3 py-2 text-left" onClick={() => applyOverrun(0)}>
            Are you done?
          </button>
          <button className="rounded-md border border-surface-border bg-surface/70 px-3 py-2 text-left" onClick={() => applyOverrun(30)}>
            Add default 30 min
          </button>
          <button className="rounded-md border border-surface-border bg-surface/70 px-3 py-2 text-left" onClick={() => applyOverrun(customOverrun)}>
            Add custom time
          </button>
          <button className="rounded-md border border-surface-border bg-surface/70 px-3 py-2 text-left" onClick={() => applyOverrun(30, true)}>
            Move remaining work later
          </button>
        </div>
        <div className="mt-3 max-w-xs">
          <label className="text-xs text-zinc-300" htmlFor="custom-overrun">Custom minutes</label>
          <input
            id="custom-overrun"
            type="number"
            min={5}
            max={180}
            value={customOverrun}
            onChange={(event) => setCustomOverrun(Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5 text-sm"
          />
        </div>
      </SectionCard>

      <SectionCard title="Warnings" description="Risk areas detected in your current plan.">
        <div className="flex flex-wrap gap-2">
          {dayPlan.warnings.map((warning) => (
            <StatusChip key={warning} label={warning} tone="warning" />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Timeline" description="Day timeline with realistic constraints.">
        <ul className="space-y-2 text-sm">
          {dayPlan.timeline.map((entry) => (
            <li key={entry.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <p className="font-medium">
                {entry.start} - {entry.end} · {entry.label}
              </p>
              <p className="mt-1 text-zinc-300">{entry.type}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Free-time suggestions" description="Useful next actions when a meaningful gap appears.">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <p className="font-medium">{suggestion.label}</p>
              <p className="mt-1 text-zinc-300">{suggestion.reason}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="What changed" description="Local scheduler explanation after each adjustment.">
        {summary ? (
          <div className="space-y-3 text-sm">
            <p className="text-zinc-100">{summary.notes.join(" ")}</p>
            <p className="text-zinc-300">Moved: {summary.moved.length ? summary.moved.join("; ") : "none"}</p>
            <p className="text-zinc-300">Shortened: {summary.shortened.length ? summary.shortened.join("; ") : "none"}</p>
            <p className="text-zinc-300">Sacrificed: {summary.sacrificed.length ? summary.sacrificed.join("; ") : "none"}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-300">No rebuild action yet.</p>
        )}
      </SectionCard>

      <div className="pb-4">
        <button
          onClick={() => setShowBlockerModal(true)}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-zinc-200 hover:border-gold/60"
        >
          Add blocker
        </button>
      </div>

      {showBlockerModal ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 md:items-center">
          <div className="onpoint-card w-full max-w-md p-4">
            <h3 className="text-lg font-semibold">Add blocker</h3>
            <p className="mt-1 text-sm text-zinc-300">Describe the disruption and rebuild the day.</p>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label htmlFor="blocker-title" className="text-zinc-300">Blocker title</label>
                <input
                  id="blocker-title"
                  value={blocker.title}
                  onChange={(event) => setBlocker((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="blocker-type" className="text-zinc-300">Type</label>
                <select
                  id="blocker-type"
                  value={blocker.type}
                  onChange={(event) => setBlocker((prev) => ({ ...prev, type: event.target.value as BlockerType }))}
                  className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
                >
                  {BLOCKER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="blocker-min" className="text-zinc-300">Lost minutes</label>
                <input
                  id="blocker-min"
                  type="number"
                  min={10}
                  max={240}
                  value={blocker.lostMinutes}
                  onChange={(event) => setBlocker((prev) => ({ ...prev, lostMinutes: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-md border border-surface-border px-3 py-2 text-sm" onClick={() => setShowBlockerModal(false)}>
                Cancel
              </button>
              <button className="rounded-md border border-gold bg-gold/15 px-3 py-2 text-sm text-gold-strong" onClick={applyBlocker}>
                Rebuild with blocker
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
