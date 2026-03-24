"use client";

import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useProgress } from "@/lib/progress-context";
import { useSubscription } from "@/lib/subscription-context";
import { getLevelById } from "@/lib/levels";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Send, PhoneOff, Loader2, Play, User, Mic, Sparkles, Volume2, VolumeX } from "lucide-react";

const INIT_GREETING = "Dzień dobry, dzwonię w sprawie naszej oferty. Czy mogę chwilę porozmawiać?";

function getMessageText(msg: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
  if (typeof msg.content === "string" && msg.content.trim()) return msg.content.trim();
  const parts = msg.parts ?? [];
  const fromParts = parts
    .filter((p): p is { type: string; text: string } => typeof (p as { text?: unknown }).text === "string")
    .map((p) => (p as { text: string }).text)
    .join("");
  if (fromParts.trim()) return fromParts.trim();
  return "";
}

/** Odblokowanie audio w kontekście gestu użytkownika (klik "Start"). */
function unlockAudioForTTS(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance("\u200B");
      u.lang = "pl-PL";
      u.volume = 0.01;
      window.speechSynthesis.speak(u);
    }
  } catch {
    // ignore
  }
}

/**
 * Tylko Google Cloud TTS (Neural2) – bez fallbacku na mechaniczny głos.
 * Gdy brak klucza Cloud TTS lub API zwróci 401/403, głos się nie odtworzy.
 */
async function speakWithGoogleTTS(
  text: string,
  options: {
    muted?: boolean;
    voice?: "male" | "female";
    signal?: AbortSignal;
    currentAudioRef?: { current: HTMLAudioElement | null };
    onTtsError?: (status: number | null, message: string) => void;
  } = {}
): Promise<void> {
  const trimmed = text?.trim();
  if (!trimmed || options.muted || typeof window === "undefined") return;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, voice: options.voice ?? "male" }),
      signal: options.signal,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      const msg = data?.error ?? res.statusText;
      options.onTtsError?.(res.status, msg);
      if (res.status === 401 || res.status === 403) {
        console.warn("[TTS] Naturalny głos wymaga klucza Cloud Text-to-Speech. Włącz API w Google Cloud i ustaw GOOGLE_TTS_API_KEY w .env.local");
      }
      return;
    }

    const data = (await res.json()) as { audio?: string; mimeType?: string };
    const base64 = data?.audio;
    if (!base64) {
      options.onTtsError?.(null, "Brak audio w odpowiedzi");
      return;
    }

    const mime = data.mimeType && /^audio\//.test(data.mimeType) ? data.mimeType : "audio/mpeg";
    const src = `data:${mime};base64,${base64}`;
    const audio = new window.Audio(src);
    if (options.currentAudioRef) {
      options.currentAudioRef.current?.pause();
      options.currentAudioRef.current = audio;
      audio.onended = () => {
        if (options.currentAudioRef?.current === audio) options.currentAudioRef.current = null;
      };
    }

    audio.onerror = () => {
      options.onTtsError?.(null, "Nie udało się odtworzyć głosu.");
    };

    await audio.play();
  } catch (e) {
    if ((e as { name?: string }).name === "AbortError") return;
    options.onTtsError?.(null, (e as Error).message ?? "Błąd odtwarzania");
    console.warn("TTS failed:", e);
  }
}

const FEEDBACK_STORAGE_KEY = "salestrainer-feedback";

export default function TrainingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const params = useParams();
  const router = useRouter();
  const levelId = Number(params.levelId);
  const level = getLevelById(levelId);
  const { isUnlocked, passLevel } = useProgress();
  const { isPro } = useSubscription();
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [ttsMuted, setTtsMuted] = useState(false);
  const [ttsErrorHint, setTtsErrorHint] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const { messages, append, status, error } = useChat({
    api: "/api/chat",
    body: { levelId },
    streamProtocol: "text",
    onError: (err) => {
      console.error("Chat API error:", err?.message ?? err);
    },
    onResponse: (res) => {
      if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
        if (!res.ok) console.error("[useChat] Response not OK:", res.status, res.statusText);
      }
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const canStart = !startedRef.current && messages.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!mounted || isStreaming || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant" || last.id === lastSpokenMessageIdRef.current) return;
    const text = getMessageText(last);
    if (!text) return;
    lastSpokenMessageIdRef.current = last.id;

    ttsAbortRef.current?.abort();
    const controller = new AbortController();
    ttsAbortRef.current = controller;

    setTtsErrorHint(null);
    speakWithGoogleTTS(text, {
      muted: ttsMuted,
      voice: "male",
      signal: controller.signal,
      currentAudioRef,
      onTtsError: (status, msg) => {
        const friendly =
          !msg || /no supported source|failed to load/i.test(msg)
            ? "Nie udało się odtworzyć głosu."
            : msg;
        setTtsErrorHint(friendly);
      },
    }).then(() => {
      if (controller === ttsAbortRef.current) ttsAbortRef.current = null;
    });
  }, [mounted, messages, isStreaming, ttsMuted]);

  if (!mounted) return null;

  if (level == null || !isUnlocked(levelId)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent text-slate-100 relative z-10">
        <p className="text-slate-400 mb-4">Nieprawidłowy lub zablokowany poziom.</p>
        <Link href="/dashboard" className="text-white font-medium hover:underline">
          Wróć do panelu
        </Link>
      </div>
    );
  }

  const handleStartCall = () => {
    if (canStart) {
      startedRef.current = true;
      unlockAudioForTTS();
      console.log("[Training] Wysyłam pierwszą wiadomość (Start) do /api/chat");
      append({ role: "user", content: INIT_GREETING }, { body: { levelId } });
    }
  };

  const handleEndAndEvaluate = async () => {
    const simpleMessages = messages.map((m) => ({
      role: m.role,
      content: getMessageText(m),
    }));
    if (simpleMessages.length === 0) {
      router.push("/dashboard");
      return;
    }
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: simpleMessages, levelId, lang: "pl" }),
      });
      if (!res.ok) throw new Error("Feedback failed");
      const feedback = await res.json();
      try {
        sessionStorage.setItem(
          FEEDBACK_STORAGE_KEY,
          JSON.stringify({ feedback, levelId })
        );
      } catch (storageErr) {
        console.error("sessionStorage.setItem failed:", storageErr);
        setIsEvaluating(false);
        return;
      }
      if (feedback.nextLevel) passLevel(levelId);
      router.push("/feedback");
    } catch (e) {
      console.error(e);
      const fallback = {
        feedback: {
          bad: "Błąd analizy.",
          borderline: "—",
          good: "—",
          comment: "Nie udało się wygenerować feedbacku. Spróbuj ponownie.",
          score: 0,
          nextLevel: false,
        },
        levelId,
      };
      try {
        sessionStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(fallback));
        router.push("/feedback");
      } catch (storageErr) {
        console.error("sessionStorage.setItem failed:", storageErr);
        setIsEvaluating(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    setInputValue("");
    console.log("[Training] Wysyłam wiadomość do /api/chat:", text.slice(0, 50));
    append({ role: "user", content: text }, { body: { levelId } });
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    type AnyWindow = Window & {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((e: { results: { [i: number]: { [i: number]: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: AnyWindow["SpeechRecognition"];
    };
    const w = typeof window !== "undefined" ? (window as AnyWindow) : null;
    const SpeechRecognitionAPI = w?.SpeechRecognition ?? w?.webkitSpeechRecognition ?? null;

    if (!SpeechRecognitionAPI) {
      alert("Twoja przeglądarka nie obsługuje dyktafonu. Użyj Chrome lub Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "pl-PL";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative z-10 font-sans">
      <header className="mx-4 mt-4 md:mx-8 rounded-full border border-white/20 bg-slate-900/60 backdrop-blur-xl px-4 md:px-8 py-3 flex justify-between items-center shadow-lg z-20">
        {canStart ? (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl text-white tracking-tight">
              <Logo />
              Sztuka{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-light">
                sprzedaży
              </span>
            </Link>
            <div className="flex items-center gap-3">
              {!isPro && (
                <Link
                  href="/pricing"
                  className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-[0_0_16px_rgba(168,85,247,0.4)] text-white border border-white/20"
                >
                  <Sparkles size={12} className="animate-pulse" aria-hidden />
                  Odblokuj PRO
                </Link>
              )}
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                Panel
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <div className="relative" aria-hidden>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl transition-all duration-300 border-2 ${
                    isStreaming
                      ? "bg-gradient-to-tr from-indigo-500 to-purple-500 border-indigo-300 shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-110"
                      : "bg-slate-800/80 border-slate-600"
                  }`}
                >
                  AI
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-slate-900 rounded-full ${
                    isStreaming ? "bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" : "bg-amber-500"
                  }`}
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg drop-shadow-md tracking-tight">{level.name}</h1>
                <div className="flex items-center gap-2">
                  {isStreaming ? (
                    <div className="flex items-end gap-0.5 h-3">
                      {[1, 0.2, 0.4, 0.1].map((_, i) => (
                        <span key={i} className="w-1 bg-emerald-400 rounded-t-sm h-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                      <span className="text-xs text-emerald-400 ml-2 font-bold uppercase tracking-widest">Klient mówi…</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Połączenie aktywne</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Panel</Link>
              <button
                type="button"
                onClick={handleEndAndEvaluate}
                disabled={isEvaluating}
                className="bg-red-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden />
                    <span className="hidden sm:inline">Analizuję…</span>
                  </>
                ) : (
                  <>
                    <PhoneOff size={18} />
                    <span className="hidden sm:inline">Zakończ i oceń</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth z-10" aria-live="polite">
        {canStart && (
          <div className="max-w-4xl w-full mx-auto p-4 md:p-8 py-12">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white mb-8 inline-flex items-center text-sm font-bold transition-colors bg-slate-900/50 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-slate-800 uppercase tracking-wider"
            >
              ← Wróć do poziomów
            </Link>
            <article className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="inline-block px-5 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-black uppercase tracking-widest mb-8">
                Level {level.id}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-xl">{level.name}</h1>
              <section className="grid sm:grid-cols-2 gap-6 text-left mb-12 max-w-2xl mx-auto">
                <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5 shadow-inner">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <User size={20} aria-hidden />
                    <h3 className="text-xs uppercase font-black tracking-widest">Typ klienta</h3>
                  </div>
                  <p className="text-base font-medium text-slate-200">{level.clientType}</p>
                </div>
                <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5 shadow-inner">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Mic size={20} aria-hidden />
                    <h3 className="text-xs uppercase font-black tracking-widest">Profil głosowy AI</h3>
                  </div>
                  <p className="text-base font-medium text-slate-200">{level.voiceName}</p>
                </div>
              </section>
              <p className="text-slate-300 mb-12 max-w-xl mx-auto font-light leading-relaxed text-lg">
                Przygotuj się. Włącz dźwięk i mikrofon. Po kliknięciu Start połączymy się – klient odezwie się pierwszy.
              </p>
              <button
                type="button"
                onClick={handleStartCall}
                className="bg-white text-slate-950 font-black py-5 px-14 rounded-full text-xl flex items-center justify-center mx-auto gap-3 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
              >
                <Play size={24} fill="currentColor" aria-hidden />
                Start rozmowy
              </button>
            </article>
          </div>
        )}

        {messages.length > 0 && (
          <>
            <div className="max-w-5xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[65%] p-5 rounded-3xl backdrop-blur-xl shadow-2xl text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600/90 text-white rounded-br-sm border border-indigo-500/50"
                        : "bg-slate-800/80 text-slate-100 border border-white/10 rounded-bl-sm"
                    }`}
                  >
                    {typeof (msg as { content?: string }).content === "string"
                      ? (
                          <p className="whitespace-pre-wrap">{(msg as { content: string }).content}</p>
                        )
                      : (msg.parts ?? []).map((part, i) =>
                          part.type === "text" ? (
                            <p key={`${msg.id}-${i}`} className="whitespace-pre-wrap">
                              {part.text}
                            </p>
                          ) : null
                        )}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start" aria-label="Klient pisze">
                  <div className="bg-slate-800/80 border border-white/10 p-5 rounded-3xl rounded-bl-sm flex gap-1.5 items-center backdrop-blur-xl shadow-lg">
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-3xl bg-red-900/40 text-red-200 border border-red-500/30 px-5 py-4 text-sm">
                  <p className="font-semibold">Błąd połączenia.</p>
                  <p className="mt-1 opacity-90">{error.message || "Sprawdź klucz API w .env.local i spróbuj ponownie."}</p>
                </div>
              )}
            </div>
            <div ref={scrollRef} className="h-4" />
          </>
        )}
      </main>

      {messages.length > 0 && (
        <footer className="bg-slate-900/80 border-t border-white/10 p-4 md:p-6 backdrop-blur-2xl z-20">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setTtsMuted((m) => {
                  const next = !m;
                  if (next) {
                    ttsAbortRef.current?.abort();
                    currentAudioRef.current?.pause();
                    currentAudioRef.current = null;
                    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
                  }
                  return next;
                });
              }}
              className={`flex-shrink-0 p-2.5 rounded-full border-2 transition-all ${
                ttsMuted ? "border-slate-500 text-slate-500 hover:border-slate-400 hover:text-slate-400" : "border-indigo-500/50 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300"
              }`}
              title={ttsMuted ? "Włącz głos bota" : "Wyłącz głos bota"}
              aria-label={ttsMuted ? "Włącz głos bota" : "Wyłącz głos bota"}
            >
              {ttsMuted ? <VolumeX size={22} aria-hidden /> : <Volume2 size={22} aria-hidden />}
            </button>
            <div className="relative flex-1">
              <input
                name="message"
                type="text"
                placeholder="Napisz lub powiedz odpowiedź…"
                disabled={isStreaming}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-950/60 border-2 border-white/10 text-white rounded-full pl-6 pr-28 py-4 md:py-5 focus:outline-none disabled:opacity-50 transition-all backdrop-blur-md text-lg focus:border-indigo-500 placeholder-slate-500"
                aria-label="Twoja wiadomość"
              />
              <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isStreaming}
                  className={`aspect-square h-full flex items-center justify-center rounded-full transition-all disabled:opacity-50 ${
                    isRecording
                      ? "bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.6)] animate-pulse"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                  }`}
                  aria-label={isRecording ? "Zatrzymaj nagrywanie" : "Dyktuj wiadomość"}
                  title={isRecording ? "Zatrzymaj nagrywanie" : "Dyktuj wiadomość"}
                >
                  <Mic size={18} aria-hidden />
                </button>
                <button
                  type="submit"
                  disabled={isStreaming}
                  className="aspect-square h-full flex items-center justify-center bg-white text-indigo-600 rounded-full hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-lg font-bold"
                  aria-label="Wyślij"
                >
                  <Send size={20} className="ml-0.5" aria-hidden />
                </button>
              </div>
            </div>
          </form>
          {ttsErrorHint && (
            <p className="mt-2 text-center text-xs text-amber-400/90 max-w-2xl mx-auto">
              {ttsErrorHint}
            </p>
          )}
        </footer>
      )}
    </div>
  );
}
