import Link from "next/link";
import Navbar from "@/components/Navbar";
import ClientOnly from "@/components/ClientOnly";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  BrainCircuit,
  List,
  MessageSquare,
  BarChart2,
  Trophy,
  Flame,
  Medal,
  ChevronDown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative z-10">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 md:p-10 relative pt-24 md:pt-28">
        <ClientOnly>
        <div className="max-w-5xl text-center space-y-8 relative z-10 py-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" aria-hidden />

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl text-white">
            Opanuj <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Sztukę Sprzedaży
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
            Trenuj negocjacje 1:1 z wymagającym klientem AI. Rozmawiaj naturalnie i zwiększ konwersję.
          </p>

          <div className="pt-4 flex flex-col items-center">
            <Link
              href="/dashboard"
              className="relative group overflow-hidden bg-white text-slate-950 font-black py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Zacznij trening
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" aria-hidden />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        <section
          id="funkcje"
          className="w-full max-w-6xl mx-auto mt-10 grid md:grid-cols-3 gap-6 md:gap-8 p-6 text-left relative z-10 border-t border-white/5 pt-16 scroll-mt-24"
        >
          <div className="pointer-events-none absolute -top-10 left-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
          <article className="relative bg-white/[0.03] p-6 md:p-7 rounded-3xl border border-white/10 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-purple-500/10 text-indigo-300 shadow-[0_0_24px_rgba(129,140,248,0.45)]">
              <BrainCircuit size={24} />
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
              Realistyczny trening AI
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Ćwicz z wirtualnymi klientami w symulacji rozmowy.
            </p>
          </article>
          <article className="relative bg-white/[0.03] p-6 md:p-7 rounded-3xl border border-white/10 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 md:translate-y-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 text-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.45)]">
              <Target size={24} />
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
              Błyskawiczny feedback
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Otrzymuj profesjonalną analizę każdej rozmowy.
            </p>
          </article>
          <article className="relative bg-white/[0.03] p-6 md:p-7 rounded-3xl border border-white/10 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-400/30 bg-pink-500/10 text-pink-300 shadow-[0_0_24px_rgba(236,72,153,0.45)]">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
              Wyższa konwersja
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Trenujący z nami zamykają więcej transakcji.
            </p>
          </article>
        </section>

        {/* Jak to działa? */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 pt-20">
          <div className="pointer-events-none absolute -z-10 inset-x-0 top-10 mx-auto h-64 max-w-xl rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">
            Prosty proces, potężne efekty
          </h2>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="flex flex-col items-center text-center bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 md:col-span-1">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/40 bg-purple-500/10 text-indigo-300 shadow-[0_0_26px_rgba(129,140,248,0.5)]">
                <List size={28} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
                Krok 1: Wybierz scenariusz
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Od chłodnych telefonów po trudne negocjacje B2B i zamykanie sprzedaży.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 md:col-span-1 md:translate-y-4">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-500/10 text-purple-300 shadow-[0_0_26px_rgba(168,85,247,0.5)]">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
                Krok 2: Negocjuj z AI
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Prowadź realistyczną rozmowę tekstową z modelem AI, który reaguje jak prawdziwy, wymagający klient.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 md:col-span-1">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-400/40 bg-pink-500/10 text-pink-300 shadow-[0_0_26px_rgba(236,72,153,0.5)]">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-2">
                Krok 3: Odbierz analizę
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dostań natychmiastowy feedback i dowiedz się, co musisz poprawić przed prawdziwą rozmową.
              </p>
            </div>
          </div>
        </section>

        {/* Wizualizacja Feedbacku */}
        <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 pt-20">
          <div className="pointer-events-none absolute -z-10 inset-x-0 top-10 mx-auto h-72 max-w-md rounded-full bg-indigo-500/25 blur-3xl" aria-hidden />
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
            Feedback, który robi różnicę
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Nasz model nie mówi, że &quot;było fajnie&quot;. Wskazuje twarde fakty, abyś od razu wiedział, nad czym pracować.
          </p>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-inner shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            <div className="space-y-5">
              <div className="flex gap-4 items-start rounded-2xl border border-red-500/30 bg-red-500/10 p-4 md:p-5 backdrop-blur-xl">
                <span className="text-xl shrink-0" aria-hidden>❌</span>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-tight text-red-200">
                    Błąd
                  </span>
                  <p className="mt-1 text-slate-300 text-sm leading-relaxed">
                    Od razu przeszedłeś do ceny, zamiast zbadać potrzeby klienta.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 md:p-5 backdrop-blur-xl">
                <span className="text-xl shrink-0" aria-hidden>⚠️</span>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-tight text-amber-200">
                    Na granicy
                  </span>
                  <p className="mt-1 text-slate-300 text-sm leading-relaxed">
                    Zbyt długa pauza przy pytaniu o konkurencję.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 md:p-5 backdrop-blur-xl">
                <span className="text-xl shrink-0" aria-hidden>✅</span>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-tight text-emerald-200">
                    Dobrze
                  </span>
                  <p className="mt-1 text-slate-300 text-sm leading-relaxed">
                    Świetnie użyłeś języka korzyści przy prezentacji funkcji.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grywalizacja i Osiągnięcia */}
        <section
          id="osiagniecia"
          className="w-full max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 pt-20 overflow-hidden scroll-mt-24"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/15 blur-[100px] rounded-full" />
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/15 blur-[80px] rounded-full" />
          </div>
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Graj o najwyższą stawkę. Śledź swój progres.
              </span>
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Odblokowuj kolejne poziomy trudności, zdobywaj odznaki i patrz, jak rosną Twoje statystyki. Trening jeszcze nigdy nie był tak wciągający.
            </p>
          </div>
          <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              {
                icon: Trophy,
                title: "Pierwsze połączenie",
                description: "Przełam lody i ukończ swój pierwszy scenariusz treningowy.",
                iconClass: "bg-amber-500/20 text-amber-400 border-amber-400/30 shadow-[0_0_30px_rgba(245,158,11,0.25)]",
              },
              {
                icon: Flame,
                title: "Rozgrzewka sprzedażowa",
                description: "Utrzymaj dobrą passę i ukończ co najmniej 3 poziomy trudności.",
                iconClass: "bg-orange-500/20 text-orange-400 border-orange-400/30 shadow-[0_0_30px_rgba(249,115,22,0.25)]",
              },
              {
                icon: Target,
                title: "Snajper argumentów",
                description: "Odblokuj wszystkie poziomy i perfekcyjnie zbijaj obiekcje klientów.",
                iconClass: "bg-indigo-500/20 text-indigo-400 border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]",
              },
              {
                icon: Medal,
                title: "Mistrz sprzedaży",
                description: "Ukończ wszystkie dostępne scenariusze z najwyższym wynikiem.",
                iconClass: "bg-pink-500/20 text-rose-300 border-pink-400/30 shadow-[0_0_30px_rgba(236,72,153,0.25)]",
              },
            ].map(({ icon: Icon, title, description, iconClass }) => (
              <article
                key={title}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${iconClass}`}>
                  <Icon size={24} aria-hidden />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 pt-20">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-transparent via-black/45 to-black/90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-10 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"
            aria-hidden
          />
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">
            Masz pytania?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="group md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-2xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
              <div className="mb-3 flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-violet-400/50 bg-violet-500/15 text-violet-200 shadow-[0_0_18px_rgba(139,92,246,0.65)]">
                  <ChevronDown size={16} aria-hidden />
                </span>
                <h3 className="text-white text-base md:text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400">
                  Czy to jest dla początkujących?
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tak. Pierwszy poziom jest łagodny i pomaga zbudować pewność. Kolejne poziomy odblokowujesz po zaliczeniu poprzedniego.
              </p>
            </article>
            <article className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-2xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
              <div className="mb-3 flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-sky-400/50 bg-sky-500/15 text-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.65)]">
                  <ChevronDown size={16} aria-hidden />
                </span>
                <h3 className="text-white text-base md:text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400">
                  Jak dokładny jest AI?
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Model analizuje rozmowę pod kątem celów scenariusza i zwraca ustrukturyzowany feedback: błędy, utracone szanse i mocne strony.
              </p>
            </article>
            <article className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-2xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
              <div className="mb-3 flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-pink-400/50 bg-pink-500/15 text-pink-200 shadow-[0_0_18px_rgba(236,72,153,0.65)]">
                  <ChevronDown size={16} aria-hidden />
                </span>
                <h3 className="text-white text-base md:text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400">
                  Czy mogę anulować subskrypcję?
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tak. Subskrypcję możesz anulować w dowolnym momencie w panelu konta. Bez długoterminowych zobowiązań.
              </p>
            </article>
            <article className="group md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-2xl shadow-inner hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
              <div className="mb-3 flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-indigo-400/50 bg-indigo-500/15 text-indigo-200 shadow-[0_0_18px_rgba(79,70,229,0.7)]">
                  <ChevronDown size={16} aria-hidden />
                </span>
                <h3 className="text-white text-base md:text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400">
                  Ile trwają scenariusze?
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Jedna rozmowa to zwykle kilka do kilkunastu wiadomości. Możesz zakończyć i odebrać feedback w dowolnym momencie.
              </p>
            </article>
          </div>
        </section>
        </ClientOnly>
      </main>

      <footer className="w-full border-t border-white/5 mt-auto bg-black/55 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-6 text-center">
          <p className="text-lg font-semibold text-white tracking-tight">
            Sztuka sprzedaży
          </p>
          <p className="text-slate-500 text-xs font-light">
            <ClientOnly>© {new Date().getFullYear()} Sztuka sprzedaży. Wszelkie prawa zastrzeżone.</ClientOnly>
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            <Link href="#" className="hover:text-slate-300 transition-colors">Regulamin</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Polityka prywatności</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Kontakt</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
