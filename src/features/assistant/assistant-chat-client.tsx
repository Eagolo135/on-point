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
    text: "I can update your tasks and calendar directly. Try: add task physics review for 40 min",
  },
];

export function AssistantChatClient() {
  const { runAssistantCommand } = usePlanner();
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  function isGithubPagesHost() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.location.hostname.endsWith("github.io");
  }

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

    const plannerResponse = runAssistantCommand(text);

    if (isGithubPagesHost()) {
      const fallbackMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: plannerResponse,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          plannerContext: plannerResponse,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat API request failed.");
      }

      const data = (await response.json()) as { reply?: string };
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: data.reply?.trim() || plannerResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const fallbackMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: plannerResponse,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col rounded-xl border border-surface-border bg-surface/80 shadow-[0_0_0_1px_rgba(200,162,77,0.08),0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="border-b border-surface-border px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point AI</p>
        <h1 className="mt-1 text-xl font-semibold md:text-2xl">Chat</h1>
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
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
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
