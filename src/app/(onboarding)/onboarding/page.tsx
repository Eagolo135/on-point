import Link from "next/link";

import { SectionCard } from "@/components/ui/section-card";

const onboardingFields = [
  "Student or work profile",
  "Class and work schedule",
  "Sleep goal and minimum sleep",
  "Commute, prep, and recovery defaults",
  "Task priorities and sacrifice preferences",
  "Productive windows and free-time suggestions",
];

export default function OnboardingPage() {
  return (
    <main className="onpoint-shell min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold md:text-3xl">Set up your On Point profile</h1>
        <p className="mt-2 text-sm text-zinc-300">
          This onboarding flow is phase-ready and currently uses local placeholder data.
        </p>

        <div className="mt-6 space-y-4">
          <SectionCard title="Onboarding checklist" description="Capture behavior profile inputs for scheduling.">
            <ul className="space-y-2 text-sm text-zinc-200">
              {onboardingFields.map((field) => (
                <li key={field} className="rounded-md border border-surface-border bg-surface/65 px-3 py-2">
                  {field}
                </li>
              ))}
            </ul>
          </SectionCard>

          <Link
            href="/dashboard"
            className="inline-flex rounded-lg border border-gold bg-gold/15 px-4 py-2 text-sm font-medium text-gold-strong"
          >
            Continue to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
