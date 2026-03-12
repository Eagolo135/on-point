import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { mockAssistant } from "@/lib/mock/mock-data";

export default function AssistantPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Assistant"
        subtitle="Chat-style planning support with honest placeholder behavior in MVP."
      />

      <SectionCard title="Conversation" description="Real AI integration will be added in a future sprint.">
        <ul className="space-y-2 text-sm">
          {mockAssistant.messages.map((message) => (
            <li key={message.id} className="rounded-md border border-surface-border bg-surface/65 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">{message.role}</p>
              <p className="mt-1">{message.text}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Quick actions" description="Tap-to-prompt actions for future smart scheduling.">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          {mockAssistant.quickActions.map((action) => (
            <button
              key={action.id}
              className="rounded-md border border-surface-border bg-surface/65 px-3 py-2 text-left hover:border-gold/50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
