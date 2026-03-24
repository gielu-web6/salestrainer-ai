import { NextResponse } from "next/server";
import { generateObject, type LanguageModelV1 } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { getLevelById } from "@/lib/levels";

const MODEL_ID = "gemini-2.5-flash";

const FeedbackSchema = z.object({
  bad: z.string().describe("Krytyczny błąd w rozmowie – co poszło źle"),
  borderline: z.string().describe("Utracona szansa – co można było zrobić lepiej"),
  good: z.string().describe("Mocny punkt – co zostało dobrze zrobione"),
  comment: z.string().describe("Krótka analiza eksperta (2–3 zdania)"),
  score: z.number().min(1).max(100).describe("Ocena 1–100"),
  nextLevel: z.boolean().describe("Czy użytkownik zaliczył poziom i może przejść dalej"),
});

export type FeedbackPayload = z.infer<typeof FeedbackSchema>;

export async function POST(req: Request) {
  const apiKey =
    process.env.GOOGLE_GENAI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Brak klucza API. Ustaw GOOGLE_GENAI_API_KEY lub GOOGLE_GENERATIVE_AI_API_KEY w .env.local" },
        { status: 500 }
      );
    }
    const body = await req.json();
    const {
      messages,
      levelId,
      lang = "pl",
    }: {
      messages: Array<{ role: string; content: string }>;
      levelId?: number;
      lang?: string;
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const level = levelId != null ? getLevelById(Number(levelId)) : undefined;
    const goal = level?.goal ?? "Przedstawienie oferty i budowa relacji.";
    const clientType = level?.clientType ?? "Klient w symulacji.";

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "Sprzedawca" : "Klient"}: ${m.content}`)
      .join("\n");

    const prompt = `Język odpowiedzi: ${lang.toUpperCase()}. Oceń tę symulację sprzedaży.
Cel poziomu: ${goal}
Profil klienta: ${clientType}

Rozmowa:
${conversationText}

Zwróć ustrukturyzowany feedback w języku ${lang === "en" ? "angielskim" : lang === "es" ? "hiszpańskim" : "polskim"}.`;

    const systemPrompt = `Jesteś wymagającym trenerem sprzedaży. Oceń rozmowę obiektywnie. 
Zwracaj TYLKO dane zgodne ze schematem: bad (string), borderline (string), good (string), comment (string), score (liczba 1-100), nextLevel (boolean). 
nextLevel = true tylko gdy sprzedawca realnie zasłużył na zaliczenie poziomu (m.in. osiągnięcie celu, profesjonalna komunikacja).`;

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const { object } = await generateObject({
      model: googleProvider(MODEL_ID) as unknown as LanguageModelV1,
      schema: FeedbackSchema,
      system: systemPrompt,
      prompt,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feedback generation failed";
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
