import { NextResponse } from "next/server";

const GEMINI_TTS_MODELS = ["gemini-2.5-flash-tts", "gemini-2.5-flash-preview-tts"] as const;
const GEMINI_TTS_URL = (model: string, apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

const CLOUD_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const CLOUD_TTS_VOICES = { male: "pl-PL-Wavenet-A", female: "pl-PL-Wavenet-B" } as const;
type CloudVoiceKey = keyof typeof CLOUD_TTS_VOICES;

/** Głosy Gemini TTS (naturalne) – nazwy z dokumentacji. */
const GEMINI_VOICES = { male: "Kore", female: "Aoede" } as const;

/** Przeglądarka nie odtwarza surowego PCM – tylko MP3, WAV, OGG itd. */
const PLAYABLE_MIME = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/webm", "audio/ogg", "audio/opus"];

/**
 * Konwertuje PCM 16-bit LE, 24 kHz mono (base64) na WAV (base64).
 * Przeglądarka nie obsługuje PCM – WAV jest obsługiwany.
 */
function pcmBase64ToWavBase64(pcmBase64: string, sampleRate = 24000): string {
  const pcm = Buffer.from(pcmBase64, "base64");
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const dataSize = pcm.length;
  const headerSize = 44;
  const wav = Buffer.alloc(headerSize + dataSize);
  let offset = 0;
  wav.write("RIFF", offset); offset += 4;
  wav.writeUInt32LE(36 + dataSize, offset); offset += 4;
  wav.write("WAVE", offset); offset += 4;
  wav.write("fmt ", offset); offset += 4;
  wav.writeUInt32LE(16, offset); offset += 4;
  wav.writeUInt16LE(1, offset); offset += 2;
  wav.writeUInt16LE(numChannels, offset); offset += 2;
  wav.writeUInt32LE(sampleRate, offset); offset += 4;
  wav.writeUInt32LE(byteRate, offset); offset += 4;
  wav.writeUInt16LE((numChannels * bitsPerSample) / 8, offset); offset += 2;
  wav.writeUInt16LE(bitsPerSample, offset); offset += 2;
  wav.write("data", offset); offset += 4;
  wav.writeUInt32LE(dataSize, offset);
  pcm.copy(wav, headerSize);
  return wav.toString("base64");
}

/**
 * 1. Próba Gemini TTS (naturalny głos).
 * 2. Fallback: Cloud Text-to-Speech (Wavenet).
 */
export async function POST(req: Request) {
  const genAiKey =
    process.env.GOOGLE_GENAI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const ttsKey = process.env.GOOGLE_TTS_API_KEY;
  const apiKey = ttsKey ?? genAiKey;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Brak klucza. Ustaw GOOGLE_GENAI_API_KEY lub GOOGLE_TTS_API_KEY w .env.local." },
      { status: 500 }
    );
  }

  let body: { text?: string; voice?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Body musi być JSON z polem text." }, { status: 400 });
  }

  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Pole 'text' (niepusty string) jest wymagane." }, { status: 400 });
  }

  const voiceParam = body.voice === "female" ? "female" : "male";

  if (genAiKey) {
    for (const model of GEMINI_TTS_MODELS) {
      const geminiAudio = await tryGeminiTTS(genAiKey, text, voiceParam, model);
      if (geminiAudio) {
        return NextResponse.json(geminiAudio);
      }
    }
  }

  const cloudAudio = await tryCloudTTS(apiKey, text, voiceParam as CloudVoiceKey);
  if (cloudAudio) {
    return NextResponse.json(cloudAudio);
  }

  return NextResponse.json(
    { error: "Nie udało się wygenerować mowy. Sprawdź klucze API (Gemini lub Cloud TTS)." },
    { status: 502 }
  );
}

async function tryGeminiTTS(
  apiKey: string,
  text: string,
  voiceKey: "male" | "female",
  model: string
): Promise<{ audio: string; mimeType?: string } | null> {
  const voiceName = GEMINI_VOICES[voiceKey];
  const payload = {
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  };

  try {
    const res = await fetch(GEMINI_TTS_URL(model, apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        const errText = await res.text();
        console.warn("[TTS] Gemini TTS error:", res.status, errText.slice(0, 200));
      }
      return null;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
      }>;
    };

    const part = data?.candidates?.[0]?.content?.parts?.[0];
    const inlineData = part?.inlineData;
    let base64 = inlineData?.data;
    let mimeType = inlineData?.mimeType ?? "";

    if (!base64 || typeof base64 !== "string") {
      return null;
    }

    const isPlayable =
      mimeType &&
      PLAYABLE_MIME.some((m) => mimeType.toLowerCase() === m.toLowerCase());
    if (!isPlayable) {
      base64 = pcmBase64ToWavBase64(base64);
      mimeType = "audio/wav";
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[TTS] Gemini TTS OK, mimeType:", mimeType);
    }
    return { audio: base64, mimeType };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[TTS] Gemini TTS exception:", e);
    }
    return null;
  }
}

async function tryCloudTTS(
  apiKey: string,
  text: string,
  voiceParam: CloudVoiceKey
): Promise<{ audio: string } | null> {
  const voiceName = CLOUD_TTS_VOICES[voiceParam];
  const payload = {
    input: { text },
    voice: { languageCode: "pl-PL", name: voiceName },
    audioConfig: {
      audioEncoding: "MP3" as const,
      speakingRate: 1,
      pitch: 0,
      sampleRateHertz: 24000,
    },
  };

  try {
    const res = await fetch(`${CLOUD_TTS_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[TTS] Cloud TTS error:", res.status, errText.slice(0, 200));
      return null;
    }

    const data = (await res.json()) as { audioContent?: string };
    const audioBase64 = data?.audioContent;
    if (!audioBase64 || typeof audioBase64 !== "string") {
      return null;
    }
    return { audio: audioBase64 };
  } catch (e) {
    console.error("[TTS] Cloud TTS exception:", e);
    return null;
  }
}
