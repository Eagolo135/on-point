import type {
  BlockerInput,
  DayPlan,
  ScheduleRebuildResult,
  TimelineEntry,
} from "@/types/domain";

type RebuildOptions = {
  blocker?: BlockerInput;
  overrunMinutes?: number;
  moveRemaining?: boolean;
};

const OPTIONAL_LABELS = ["journal", "entertainment", "social", "optional"];

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(total: number): string {
  const normalized = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const m = (normalized % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function shiftEntry(entry: TimelineEntry, minutes: number): TimelineEntry {
  return {
    ...entry,
    start: fromMinutes(toMinutes(entry.start) + minutes),
    end: fromMinutes(toMinutes(entry.end) + minutes),
  };
}

function isOptionalEntry(entry: TimelineEntry): boolean {
  return OPTIONAL_LABELS.some((label) => entry.label.toLowerCase().includes(label));
}

export function rebuildDayPlan(current: DayPlan, options: RebuildOptions): ScheduleRebuildResult {
  const timeline = [...current.timeline];
  const moved: string[] = [];
  const shortened: string[] = [];
  const sacrificed: string[] = [];
  const warnings = [...current.warnings];
  const notes: string[] = [];

  let shift = 0;
  const focusIndex = timeline.findIndex((entry) => entry.label === current.currentTask);
  const startIndex = focusIndex >= 0 ? focusIndex : Math.max(0, timeline.length - 1);

  if (options.blocker && options.blocker.lostMinutes > 0) {
    shift += options.blocker.lostMinutes;
    const anchor = timeline[startIndex];
    const blockerStart = anchor ? anchor.end : "12:00";
    const blockerEnd = fromMinutes(toMinutes(blockerStart) + options.blocker.lostMinutes);

    timeline.splice(startIndex + 1, 0, {
      id: `blocker-${Date.now()}`,
      label: options.blocker.title,
      type: "blocker",
      start: blockerStart,
      end: blockerEnd,
    });

    notes.push(`${options.blocker.title} consumed ${options.blocker.lostMinutes} minutes.`);
  }

  if (options.overrunMinutes && options.overrunMinutes > 0) {
    if (options.moveRemaining) {
      notes.push(`Remaining work moved later (${options.overrunMinutes} min).`);
    } else {
      shift += options.overrunMinutes;
      notes.push(`Current task extended by ${options.overrunMinutes} minutes.`);
    }
  }

  if (shift > 0) {
    for (let index = startIndex + 1; index < timeline.length; index += 1) {
      const entry = timeline[index];
      const shifted = shiftEntry(entry, shift);
      timeline[index] = shifted;
      moved.push(`${entry.label} to ${shifted.start}`);
    }
  }

  const dayEndRisk = timeline.some((entry) => toMinutes(entry.end) > 23 * 60 + 20);
  if (dayEndRisk) {
    warnings.push("Minimum sleep may be at risk after adjustments.");
  }

  let adjustedTimeline = timeline;
  if (dayEndRisk) {
    const optionalIndex = timeline.findIndex(isOptionalEntry);
    if (optionalIndex >= 0) {
      const [removed] = timeline.splice(optionalIndex, 1);
      sacrificed.push(removed.label);
      adjustedTimeline = timeline;
      notes.push("Dropped an optional item to protect schedule realism.");
    } else {
      const firstTaskIndex = timeline.findIndex((entry) => entry.type === "task");
      if (firstTaskIndex >= 0) {
        const entry = timeline[firstTaskIndex];
        const shortenedEnd = fromMinutes(toMinutes(entry.end) - 15);
        timeline[firstTaskIndex] = { ...entry, end: shortenedEnd };
        shortened.push(`${entry.label} by 15 minutes`);
      }
    }
  }

  const nextEntry = adjustedTimeline.find((entry) => toMinutes(entry.start) > toMinutes(adjustedTimeline[startIndex]?.start ?? "00:00"));

  return {
    plan: {
      ...current,
      nextTask: nextEntry?.label ?? current.nextTask,
      timeline: adjustedTimeline,
      warnings,
    },
    summary: {
      moved,
      shortened,
      sacrificed,
      warnings,
      notes: notes.length ? notes : ["No major changes were needed."],
    },
  };
}
