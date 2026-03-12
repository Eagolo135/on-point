import type { DayPlan, FreeTimeSuggestion, UserProfile } from "@/types/domain";

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const SUGGESTION_POOL: FreeTimeSuggestion[] = [
  { id: "s1", label: "Go for a walk", reason: "Good reset between heavy focus blocks." },
  { id: "s2", label: "Meal prep", reason: "Protects your evening time later." },
  { id: "s3", label: "Stretch for 10 minutes", reason: "Useful when energy is dipping." },
  { id: "s4", label: "Short study sprint", reason: "Fits medium windows well." },
  { id: "s5", label: "Journal", reason: "Great for closing loops after busy blocks." },
  { id: "s6", label: "Power rest", reason: "Helps preserve consistency and sleep quality." },
];

export function getFreeTimeSuggestions(dayPlan: DayPlan, profile: UserProfile): FreeTimeSuggestion[] {
  const sorted = [...dayPlan.timeline].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  let hasUsefulGap = false;

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];
    const gap = toMinutes(next.start) - toMinutes(current.end);
    if (gap >= 20) {
      hasUsefulGap = true;
      break;
    }
  }

  const hasEveningWindow = profile.productiveWindows.some((window) => toMinutes(window.end) >= 18 * 60);

  if (hasUsefulGap) {
    return hasEveningWindow ? SUGGESTION_POOL.slice(0, 4) : SUGGESTION_POOL.slice(1, 5);
  }

  return SUGGESTION_POOL.slice(2, 5);
}
