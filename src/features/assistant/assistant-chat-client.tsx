"use client";

import { useState } from "react";

import { usePlanner } from "@/features/planner/planner-context";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const STARTER: ChatMessage[] = [
  {
    id: "m-1",
    role: "assistant",
    text: "I’m point-chat.ai. I can chat naturally and actively manage your tasks and schedule. Try: add task physics review for 40 min",
  },
];

export function AssistantChatClient() {
  const { runPointChat, pendingProposal, confirmPendingProposal, cancelPendingProposal } = usePlanner();
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function submit() {
    const text = input.trim();
    if (!text || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    setIsSending(true);
    const response = runPointChat(text);
    const assistantMessage: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: response.message,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsSending(false);
  }

  function confirmProposal() {
    const message = confirmPendingProposal();
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: message,
      },
    ]);
  }

  function rejectProposal() {
    cancelPendingProposal();
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "All good — I canceled that change. We can try a different plan.",
      },
    ]);
  }

  return (
    <div className="flex min-h-[80vh] flex-col rounded-xl border border-surface-border bg-surface/80 shadow-[0_0_0_1px_rgba(200,162,77,0.08),0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="border-b border-surface-border px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">point-chat.ai</p>
        <h1 className="mt-1 text-xl font-semibold md:text-2xl">Companion Planner</h1>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm md:max-w-[70%] ${
                message.role === "user"
                  ? "border border-gold/50 bg-gold/15 text-zinc-100"
                  : "border border-surface-border bg-background text-zinc-200"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isSending ? (
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl border border-surface-border bg-background px-4 py-3 text-sm text-zinc-400 md:max-w-[70%]">
              Thinking...
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-surface-border p-3">
        {pendingProposal ? (
          <div className="mb-3 rounded-md border border-gold/40 bg-gold/10 p-3 text-xs">
            <p className="font-medium text-gold-strong">Confirmation needed: {pendingProposal.title}</p>
            <p className="mt-1 text-zinc-200">{pendingProposal.summary}</p>
            {pendingProposal.warnings.length ? (
              <ul className="mt-1 list-disc pl-4 text-zinc-300">
                {pendingProposal.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-2 flex gap-2">
              <button
                onClick={confirmProposal}
                className="rounded-md border border-gold bg-gold/20 px-2.5 py-1 text-[11px] text-gold-strong"
              >
                Confirm changes
              </button>
              <button
                onClick={rejectProposal}
                className="rounded-md border border-surface-border px-2.5 py-1 text-[11px] text-zinc-200"
              >
                Keep current schedule
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submit();
              }
            }}
            placeholder="Tell me what to schedule or update..."
            className="flex-1 rounded-lg border border-surface-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={() => void submit()}
            disabled={isSending}
            className="rounded-lg border border-gold bg-gold/15 px-4 py-2 text-sm text-gold-strong disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
