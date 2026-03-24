import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { getLevelById } from "@/lib/levels";

const MODEL_ID = "gemini-2.0-flash";

/** Test: otwórz w przeglądarce http://localhost:3000/api/chat – w terminalu powinno pojawić się "[chat] GET /api/chat" */
export async function GET() {
  console.log("[chat] GET /api/chat hit (test)");
  return NextResponse.json({ ok: true, message: "Route działa. POST używaj z useChat." });
}

function normalizeMessages(
  raw: Array<{ role: string; content?: string; parts?: Array<{ type: string; text?: string }> }>
): Array<{ role: "user" | "assistant"; content: string }> {
  const out: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const m of raw) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const text =
      typeof m.content === "string"
        ? m.content.trim()
        : (m.parts
            ?.filter((p): p is { type: string; text: string } => p.type === "text" && typeof p.text === "string")
            .map((p) => p.text)
            .join("") ?? "").trim();
    if (text) out.push({ role: m.role as "user" | "assistant", content: text });
  }
  return out;
}

export async function POST(req: Request) {
  console.log("[chat] POST /api/chat hit");

  const apiKey =
    process.env.GOOGLE_GENAI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error("[chat] Missing GOOGLE_GENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY");
    return NextResponse.json(
      { error: "API Key missing in environment" },
      { status: 500 }
    );
  }

  let body: {
    messages?: Array<{ role: string; content?: string; parts?: Array<{ type: string; text?: string }> }>;
    levelId?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch (e) {
    console.error("[chat] Invalid JSON body", e);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages: rawMessages, levelId } = body;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    console.log("[chat] 400: messages missing or empty");
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const modelMessages = normalizeMessages(rawMessages);
  if (modelMessages.length === 0) {
    console.log("[chat] 400: no valid messages after normalize");
    return NextResponse.json({ error: "No valid messages" }, { status: 400 });
  }

  const last = modelMessages[modelMessages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from user" },
      { status: 400 }
    );
  }

  const level = levelId != null ? getLevelById(Number(levelId)) : undefined;
  const systemPrompt =
    level?.systemPrompt ??
    "Jesteś klientem w symulacji sprzedaży. Odpowiadaj krótko po polsku.";

  if (process.env.NODE_ENV === "development") {
    console.log("[chat] Request:", { levelId, messageCount: modelMessages.length, lastContent: last.content?.slice(0, 80) });
  }
  console.log("[chat] Calling Gemini...");

  const googleProvider = createGoogleGenerativeAI({ apiKey });
  const model = googleProvider(MODEL_ID);

  try {
    const result = streamText({
      model,
      system: systemPrompt,
      messages: modelMessages,
    });
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[chat] Gemini error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
