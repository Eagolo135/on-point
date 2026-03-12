import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { mockProfile } from "@/lib/mock/mock-data";

export default function ProfilePage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Profile"
        subtitle="Your scheduling preferences, constraints, and productivity defaults."
      />

      <SectionCard title="Sleep settings">
        <p className="text-sm text-zinc-200">Goal: {mockProfile.sleep.goalHours}h</p>
        <p className="mt-1 text-sm text-zinc-300">Minimum: {mockProfile.sleep.minimumHours}h</p>
      </SectionCard>

      <SectionCard title="Default timing assumptions">
        <ul className="space-y-1 text-sm text-zinc-200">
          <li>Commute default: {mockProfile.defaults.travelMinutes} min</li>
          <li>Prep default: {mockProfile.defaults.prepMinutes} min</li>
          <li>Recovery default: {mockProfile.defaults.recoveryMinutes} min</li>
        </ul>
      </SectionCard>

      <SectionCard title="Sacrifice preferences">
        <ul className="space-y-1 text-sm text-zinc-200">
          {mockProfile.sacrificePreferences.map((preference) => (
            <li key={preference}>- {preference}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
