"use client";

import { useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { mockProfile } from "@/lib/mock/mock-data";

export default function ProfilePage() {
  const [customizeSettings, setCustomizeSettings] = useState(false);
  const [sleepGoalHours, setSleepGoalHours] = useState(mockProfile.sleep.goalHours);
  const [sleepMinimumHours, setSleepMinimumHours] = useState(mockProfile.sleep.minimumHours);
  const [travelMinutes, setTravelMinutes] = useState(mockProfile.defaults.travelMinutes);
  const [prepMinutes, setPrepMinutes] = useState(mockProfile.defaults.prepMinutes);
  const [recoveryMinutes, setRecoveryMinutes] = useState(mockProfile.defaults.recoveryMinutes);

  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Profile"
        subtitle="Profile settings are optional. Keep defaults or customize if you want."
      />

      <SectionCard title="Settings mode" description="Choose whether to customize profile settings.">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCustomizeSettings(false)}
            className={`rounded-md border px-3 py-1.5 text-xs ${
              !customizeSettings
                ? "border-gold bg-gold/15 text-gold-strong"
                : "border-surface-border bg-surface/70 text-zinc-300"
            }`}
          >
            Use defaults
          </button>
          <button
            type="button"
            onClick={() => setCustomizeSettings(true)}
            className={`rounded-md border px-3 py-1.5 text-xs ${
              customizeSettings
                ? "border-gold bg-gold/15 text-gold-strong"
                : "border-surface-border bg-surface/70 text-zinc-300"
            }`}
          >
            Customize (optional)
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Sleep settings">
        {customizeSettings ? (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <label htmlFor="sleep-goal" className="text-zinc-300">Goal hours</label>
              <input
                id="sleep-goal"
                type="number"
                min={4}
                max={12}
                step={0.5}
                value={sleepGoalHours}
                onChange={(event) => setSleepGoalHours(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
              />
            </div>
            <div>
              <label htmlFor="sleep-min" className="text-zinc-300">Minimum hours</label>
              <input
                id="sleep-min"
                type="number"
                min={4}
                max={12}
                step={0.5}
                value={sleepMinimumHours}
                onChange={(event) => setSleepMinimumHours(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-200">Goal: {mockProfile.sleep.goalHours}h</p>
            <p className="mt-1 text-sm text-zinc-300">Minimum: {mockProfile.sleep.minimumHours}h</p>
          </>
        )}
      </SectionCard>

      <SectionCard title="Default timing assumptions">
        {customizeSettings ? (
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <label htmlFor="travel" className="text-zinc-300">Commute (min)</label>
              <input
                id="travel"
                type="number"
                min={0}
                max={240}
                value={travelMinutes}
                onChange={(event) => setTravelMinutes(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
              />
            </div>
            <div>
              <label htmlFor="prep" className="text-zinc-300">Prep (min)</label>
              <input
                id="prep"
                type="number"
                min={0}
                max={240}
                value={prepMinutes}
                onChange={(event) => setPrepMinutes(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
              />
            </div>
            <div>
              <label htmlFor="recovery" className="text-zinc-300">Recovery (min)</label>
              <input
                id="recovery"
                type="number"
                min={0}
                max={240}
                value={recoveryMinutes}
                onChange={(event) => setRecoveryMinutes(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface px-2 py-1.5"
              />
            </div>
          </div>
        ) : (
          <ul className="space-y-1 text-sm text-zinc-200">
            <li>Commute default: {mockProfile.defaults.travelMinutes} min</li>
            <li>Prep default: {mockProfile.defaults.prepMinutes} min</li>
            <li>Recovery default: {mockProfile.defaults.recoveryMinutes} min</li>
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Sacrifice preferences (optional)">
        <ul className="space-y-1 text-sm text-zinc-200">
          {mockProfile.sacrificePreferences.map((preference) => (
            <li key={preference}>- {preference}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
