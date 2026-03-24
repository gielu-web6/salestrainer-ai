"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  XCircle,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Award,
  Sparkles,
} from "lucide-react";
import { LEVELS } from "@/lib/levels";
import { useSubscription } from "@/lib/subscription-context";

const FEEDBACK_STORAGE_KEY = "salestrainer-feedback";

interface FeedbackPayload {
  bad: string;
  borderline: string;
  good: string;
  comment: string;
  score: number;
  nextLevel: boolean;
}

export default function FeedbackPage() {
  const router = useRouter();
  const { isPro } = useSubscription();
  const [data, setData] = useState<{ feedback: FeedbackPayload; levelId: number } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!raw) {
        router.replace("/dashboard");
        return;
      }
      const parsed = JSON.parse(raw) as { feedback: FeedbackPayload; levelId: number };
      setData(parsed);
      sessionStorage.removeItem(FEEDBACK_STORAGE_KEY);
    } catch {
      router.replace("/dashboard");
    }
  }, [router]);

  if (data === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent text-slate-100 relative z-10">
        <div className="bg-slate-900/60 p-16 rounded-[3rem] backdrop-blur-2xl border border-white/10 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-8" />
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Trener analizuje rozmowę…</h1>
          <p className="text-slate-300 font-light text-lg">Sprawdzamy Twoją psychologię sprzedaży…</p>
        </div>
      </div>
    );
  }

  const { feedback, levelId } = data;
  const level = LEVELS.find((l) => l.id === levelId);
  const nextLevel = levelId < LEVELS.length ? LEVELS.find((l) => l.id === levelId + 1) : null;
  const isSuccess = feedback.nextLevel;
  const scoreColor =
    feedback.score >= 80
      ? "text-emerald-400"
      : feedback.score >= 60
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative z-10">
      <header className="bg-slate-900/40 border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center backdrop-blur-xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-black text-xl text-white tracking-tight"
        >
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
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 py-10">
        <article className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-8 backdrop-blur-2xl overflow-hidden relative">
          <div
            className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`}
            aria-hidden
          />

          <header className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">Raport treningowy</h1>
            <p className="text-indigo-300 font-medium uppercase tracking-widest text-sm">{level?.name ?? `Poziom ${levelId}`}</p>
          </header>

          <section className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12 pb-12 border-b border-white/10">
            <div className="text-center">
              <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Twój wynik</h2>
              <div className={`text-7xl font-black tracking-tighter ${scoreColor} drop-shadow-[0_0_20px_currentColor]`}>
                {feedback.score}
                <span className="text-3xl text-slate-500 font-normal opacity-50">/100</span>
              </div>
            </div>
            <div className="h-24 w-px bg-white/10 hidden md:block" aria-hidden />
            <div
              className={`flex items-center gap-5 px-8 py-6 rounded-3xl border backdrop-blur-md ${
                isSuccess
                  ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                  : "bg-red-950/30 border-red-500/30 text-red-400"
              }`}
            >
              {isSuccess ? (
                <Award size={48} className="drop-shadow-[0_0_15px_currentColor]" aria-hidden />
              ) : (
                <AlertTriangle size={48} className="drop-shadow-[0_0_15px_currentColor]" aria-hidden />
              )}
              <div>
                <h3 className="text-2xl font-black">
                  {isSuccess ? "Poziom zaliczony!" : "Jeszcze nie tym razem"}
                </h3>
              </div>
            </div>
          </section>

          <section className="space-y-4 mb-12">
            <article className="flex gap-5 items-start bg-red-950/20 p-6 rounded-2xl border border-red-500/10 backdrop-blur-sm">
              <div className="bg-red-500/10 p-3 rounded-xl text-red-400 border border-red-500/20 shrink-0" aria-hidden>
                <XCircle size={28} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs text-red-300">Krytyczny błąd</h4>
                <p className="text-slate-200 text-lg leading-relaxed">{feedback.bad}</p>
              </div>
            </article>
            <article className="flex gap-5 items-start bg-amber-950/20 p-6 rounded-2xl border border-amber-500/10 backdrop-blur-sm">
              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 border border-amber-500/20 shrink-0" aria-hidden>
                <AlertTriangle size={28} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs text-amber-300">Utracona szansa</h4>
                <p className="text-slate-200 text-lg leading-relaxed">{feedback.borderline}</p>
              </div>
            </article>
            <article className="flex gap-5 items-start bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/10 backdrop-blur-sm">
              <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0" aria-hidden>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs text-emerald-300">Mocny punkt</h4>
                <p className="text-slate-200 text-lg leading-relaxed">{feedback.good}</p>
              </div>
            </article>
          </section>

          <section className="bg-indigo-950/30 p-8 rounded-3xl border border-indigo-500/20 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={24} className="text-indigo-400" aria-hidden />
              <h4 className="font-black text-white uppercase text-sm tracking-widest">Analiza eksperta</h4>
            </div>
            <p className="text-indigo-100 font-light italic leading-relaxed text-xl">&quot;{feedback.comment}&quot;</p>
          </section>
        </article>

        <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Akcje po feedbacku">
          <Link
            href="/dashboard"
            className="px-10 py-5 rounded-full font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors backdrop-blur-md uppercase tracking-wider text-sm text-center"
          >
            ← Wróć do poziomów
          </Link>
          {isSuccess && nextLevel ? (
            <Link
              href={`/training/${nextLevel.id}`}
              className="px-10 py-5 rounded-full font-black text-slate-900 bg-white hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] uppercase tracking-wider text-sm"
            >
              Kolejny poziom
              <ArrowRight size={20} aria-hidden />
            </Link>
          ) : (
            <Link
              href={`/training/${levelId}`}
              className="px-10 py-5 rounded-full font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.4)] uppercase tracking-wider text-sm"
            >
              Powtórz poziom
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
