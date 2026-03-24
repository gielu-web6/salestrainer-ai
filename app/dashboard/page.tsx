"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useProgress } from "@/lib/progress-context";
import { useSubscription } from "@/lib/subscription-context";
import { LEVELS } from "@/lib/levels";
import {
  Lock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Sparkles,
  Star,
  Trophy,
  Medal,
  Target,
  Flame,
} from "lucide-react";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const isLow = difficulty === "Niska";
  const isMed = difficulty === "Średnia";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
        isLow ? "text-emerald-400" : isMed ? "text-amber-400" : "text-red-400"
      }`}
    >
      <Zap size={14} aria-hidden />
      {difficulty}
    </span>
  );
}

export default function DashboardPage() {
  const { isUnlocked } = useProgress();
  const { isPro } = useSubscription();

  const unlockedCount = LEVELS.filter((lvl) => isUnlocked(lvl.id)).length;
  const completedCount = LEVELS.filter(
    (lvl) => lvl.id > 1 && isUnlocked(lvl.id) && isUnlocked(lvl.id + 1)
  ).length;

  const badges = [
    {
      id: 1,
      title: "Pierwsze połączenie",
      description: "Ukończ pierwszy scenariusz treningowy.",
      icon: Trophy,
      earned: completedCount >= 1,
    },
    {
      id: 2,
      title: "Rozgrzewka sprzedażowa",
      description: "Ukończ co najmniej 3 poziomy.",
      icon: Flame,
      earned: completedCount >= 3,
    },
    {
      id: 3,
      title: "Snajper argumentów",
      description: "Odblokuj wszystkie poziomy treningu.",
      icon: Target,
      earned: unlockedCount === LEVELS.length,
    },
    {
      id: 4,
      title: "Mistrz sprzedaży",
      description: "Ukończ wszystkie dostępne scenariusze.",
      icon: Medal,
      earned: completedCount === LEVELS.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative z-10 noise-bg">
      <header className="bg-slate-900/40 border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-xl md:text-2xl text-white tracking-tight"
        >
          <Logo />
          Sztuka{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-light">
            sprzedaży
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          {!isPro ? (
            <Link
              href="/pricing"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-1.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all text-white border border-white/20"
            >
              <Sparkles size={14} className="animate-pulse" aria-hidden />
              Odblokuj PRO
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 border border-yellow-500/30 bg-yellow-900/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.2)]">
              <Star size={14} className="text-yellow-400" aria-hidden />
              KONTO PRO
            </span>
          )}
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Strona główna
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 py-10">
        {!isPro && (
          <section className="mb-10 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                <Sparkles className="text-indigo-400" size={28} aria-hidden />
                Zwiększ swoje możliwości
              </h2>
              <p className="text-indigo-200 font-light text-sm md:text-base max-w-2xl">
                Odblokuj trudnych klientów, zaawansowane scenariusze i pełny dostęp do wszystkich poziomów treningu.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 bg-white text-indigo-900 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] text-sm md:text-base"
            >
              Zobacz plany
            </Link>
          </section>
        )}
        <header className="mb-8 md:mb-10">
          <h1 className="text-4xl font-black mb-2 text-white drop-shadow-lg tracking-tight">
            Panel treningowy
          </h1>
          <p className="text-slate-300 font-light text-lg">
            Wybierz scenariusz, zbieraj odznaki i szlifuj swój warsztat.
          </p>
        </header>

        <section className="mb-10 grid gap-4 md:grid-cols-[2fr,3fr]" aria-label="Postępy i odznaki">
          <article className="bg-white/[0.03] border border-white/10 rounded-[1.75rem] p-5 md:p-6 backdrop-blur-2xl shadow-inner shadow-[0_0_30px_rgba(15,23,42,0.8)]">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
              Statystyki treningu
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-4 flex flex-col gap-1 backdrop-blur-xl">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                  Odblokowane poziomy
                </span>
                <span className="text-2xl font-black text-white">
                  {unlockedCount}
                  <span className="text-slate-500 text-base font-semibold"> / {LEVELS.length}</span>
                </span>
              </div>
              <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-4 flex flex-col gap-1 backdrop-blur-xl">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                  Ukończone scenariusze
                </span>
                <span className="text-2xl font-black text-white">{completedCount}</span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-widest">
                <span>Postęp poziomów</span>
                <span className="text-slate-300 font-semibold">
                  {Math.round((completedCount / LEVELS.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-900/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-blue-400 shadow-[0_0_14px_rgba(129,140,248,0.9)]"
                  style={{ width: `${(completedCount / LEVELS.length) * 100}%` }}
                />
              </div>
            </div>
          </article>

          <article className="bg-white/[0.03] border border-white/10 rounded-[1.75rem] p-5 md:p-6 backdrop-blur-2xl overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Osiągnięcia i odznaki
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {badges.filter((b) => b.earned).length}/{badges.length}{" "}
                  <span className="text-slate-500">odblokowanych</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`group rounded-2xl border p-3 flex gap-3 items-start backdrop-blur-md transition-all ${
                        badge.earned
                          ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                          : "border-slate-700/70 bg-slate-950/40 opacity-70"
                      }`}
                    >
                      <div
                        className={`mt-0.5 rounded-xl p-2.5 shrink-0 border text-xs ${
                          badge.earned
                            ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                            : "bg-slate-900/80 border-slate-700/80 text-slate-400"
                        }`}
                      >
                        <Icon size={18} aria-hidden />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                          {badge.title}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </section>

          <section
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Poziomy treningowe"
          >
          {LEVELS.map((level) => {
            const unlocked = isUnlocked(level.id);
            const completed = level.id > 1 && isUnlocked(level.id) && isUnlocked(level.id + 1);
            const canClick = unlocked;

            const cardContent = (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-blue-400/15 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Level {level.id}
                      </span>
                      <div className="flex gap-2">
                        {!unlocked && (
                          <span
                            className="bg-white/[0.04] p-2 rounded-full text-red-400 border border-red-500/40 shadow-[0_0_18px_rgba(248,113,113,0.7)]"
                            aria-label="Zablokowany"
                          >
                            <Lock size={16} />
                          </span>
                        )}
                        {unlocked && completed && (
                          <span
                            className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 border border-emerald-500/30"
                            aria-label="Ukończony"
                          >
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">{level.name}</h2>
                    <p className="text-sm text-slate-300 mb-8 h-10 line-clamp-2 font-light leading-relaxed">
                      {level.goal}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <DifficultyBadge difficulty={level.difficulty} />
                      {canClick && (
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-400/90 group-hover:shadow-[0_0_18px_rgba(56,189,248,0.9)] transition-all duration-300">
                          <ChevronRight className="text-white" size={16} aria-hidden />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );

            return canClick ? (
              <Link
                key={level.id}
                href={`/training/${level.id}`}
                className={`group relative p-8 rounded-[2rem] border transition-all duration-500 backdrop-blur-2xl overflow-hidden block bg-white/[0.03] border-white/10 hover:border-cyan-400/80 hover:bg-white/[0.06] cursor-pointer hover:shadow-[0_0_36px_rgba(56,189,248,0.45)] hover:-translate-y-2`}
              >
                {cardContent}
              </Link>
            ) : (
              <article
                key={level.id}
                className="group relative p-8 rounded-[2rem] border transition-all duration-500 backdrop-blur-2xl overflow-hidden bg-white/[0.02] border-white/10 opacity-70 cursor-not-allowed"
              >
                {cardContent}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
