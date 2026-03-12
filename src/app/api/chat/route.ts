import { NextResponse } from "next/server";

type IncomingMessage = {
  role: "user" | "assistant";
  text: string;
};

type ChatRequestBody = {
  messages?: IncomingMessage[];
  plannerContext?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as ChatRequestBody;
  const messages = body.messages ?? [];

  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const systemPrompt = [
    "You are On Point, a planning assistant for productivity and scheduling.",
    "Keep responses concise, practical, and action-oriented.",
    body.plannerContext
      ? `The app already performed this local planning action: ${body.plannerContext}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const payload = {
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((message) => ({
        role: message.role,
        content: message.text,
      })),
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `OpenAI request failed: ${errorText}` },
      { status: response.status },
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const reply = data.choices?.[0]?.message?.content?.trim();

  return NextResponse.json({
    reply: reply || "I updated your plan. What should we work on next?",
  });
}
