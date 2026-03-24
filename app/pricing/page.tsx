"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useSubscription } from "@/lib/subscription-context";
import { Check, Sparkles, Zap, Target, MessageSquare, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "starter", name: "Początkujący", price: "89.99", subtitle: "1 miesiąc", highlight: false },
  { id: "expert", name: "Ekspert", price: "209.99", subtitle: "3 miesiące", highlight: true },
  { id: "master", name: "Mistrz sprzedaży", price: "319.99", subtitle: "6 miesięcy", highlight: false },
];

const PLAN_FEATURES: Record<string, string[]> = {
  starter: [
    "Opanuj fundamenty skutecznej sprzedaży na wszystkich poziomach.",
    "Trenuj bez ograniczeń i buduj pewność siebie w każdej rozmowie.",
    "Otrzymuj natychmiastową analizę błędów i wskazówki do poprawy.",
    "Powtarzaj kluczowe scenariusze, aż osiągniesz perfekcję.",
  ],
  expert: [
    "Dostęp do zaawansowanych technik i trudnych profili klientów.",
    "Szlifuj umiejętności w realistycznych, wymagających symulacjach.",
    "Głęboka analiza psychologiczna i taktyczna każdej interakcji.",
    "Doskonal strategie negocjacyjne na elitarnym poziomie.",
  ],
  master: [
    "Odblokuj wszystkie scenariusze VIP i ekskluzywne materiały.",
    "Stań się ekspertem w zamykaniu sprzedaży i budowaniu relacji.",
    "Personalizowany plan rozwoju oparty na Twoich wynikach.",
    "Zmierz swoje postępy i dołącz do grona topowych sprzedawców.",
  ],
};

export default function PricingPage() {
  const { setPro } = useSubscription();
  const router = useRouter();

  const handleChoose = (planId: string) => {
    // Symulacja zakupu – w realnej aplikacji tu wpięcie Stripe / Paddle
    setPro(true);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative z-10">
      <header className="mx-4 mt-4 md:mx-8 rounded-full border border-white/20 bg-slate-900/60 backdrop-blur-xl px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-black text-xl md:text-2xl text-white tracking-tight"
        >
          <Logo />
          Sztuka{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-light">
            sprzedaży
          </span>
        </Link>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
          Panel
        </Link>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col items-center justify-center relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-40 -z-10 h-80 bg-gradient-to-br from-purple-500/20 via-sky-500/10 to-transparent blur-3xl"
          aria-hidden
        />
        <header className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
            Zainwestuj w{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              swoje skille sprzedażowe
            </span>
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            Odblokuj trudnych klientów, zaawansowane scenariusze i pełny dostęp do wszystkich poziomów.
          </p>
        </header>

        <section
          className="relative grid md:grid-cols-3 gap-8 w-full max-w-5xl items-stretch"
          aria-label="Plany subskrypcji"
        >
          <div
            className="pointer-events-none absolute -bottom-10 left-0 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 right-4 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl"
            aria-hidden
          />
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col min-w-[300px] flex-shrink-0 rounded-3xl transition-all duration-300 ${
                plan.highlight
                  ? "pricing-featured p-0 md:-translate-y-4 shadow-[0_0_50px_rgba(129,140,248,0.4)] min-h-[600px]"
                  : "h-full border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl hover:border-purple-500/40 hover:shadow-[0_0_32px_rgba(148,163,184,0.28)]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 right-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                  <Sparkles size={10} aria-hidden /> Najpopularniejszy
                </div>
              )}
              <div
                className={`relative z-10 flex flex-1 flex-col ${plan.highlight ? "m-[3px] rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl" : ""}`}
              >
                <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
                <p className="text-indigo-300 text-sm mb-6 font-medium h-5">{plan.subtitle}</p>
                <div
                  className={`mb-8 tracking-tight ${
                    plan.highlight
                      ? "text-5xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      : "text-5xl font-black text-white"
                  }`}
                >
                  {plan.price}
                  <span className="align-top text-lg text-slate-400/80 font-semibold ml-1">zł</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1 min-h-0" aria-label={`Funkcje planu ${plan.name}`}>
                  {(PLAN_FEATURES[plan.id] ?? PLAN_FEATURES.starter).map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-200 text-sm">
                      <Check size={18} className="text-indigo-400 shrink-0 mt-0.5" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleChoose(plan.id)}
                  className={`relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-lg font-bold text-white transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-40 ${
                    plan.highlight
                      ? "navbar-cta-gradient pricing-cta-pulse hover:shadow-[0_0_32px_rgba(168,85,247,0.7)]"
                      : "bg-white/5 border border-white/15 hover:border-purple-400/70 hover:bg-white/10"
                  }`}
                >
                  <span className="relative z-10">Wybierz plan</span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <p className="text-xs text-slate-500 mt-8 max-w-xl text-center">
          Ceny poglądowe. Integrację z prawdziwym systemem płatności (np. Stripe) możesz wpiąć w tym miejscu.
        </p>

        <section className="w-full max-w-4xl mx-auto mt-16 md:mt-24 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Co otrzymujesz w planach PRO
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-white/5">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Wszystkie poziomy treningu</h3>
                <p className="text-sm text-slate-400">Dostęp do 5 scenariuszy: od łagodnego klienta po trudne zamknięcie i obiekcje cenowe.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-white/5">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Feedback po każdej rozmowie</h3>
                <p className="text-sm text-slate-400">Strukturyzowana ocena: błędy, utracone szanse i mocne strony – po polsku.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-white/5">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Symulacja w czasie rzeczywistym</h3>
                <p className="text-sm text-slate-400">Rozmowa z AI w formie czatu; możesz ćwiczyć kiedy chcesz, bez umawiania spotkań.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-white/5">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Anuluj kiedy chcesz</h3>
                <p className="text-sm text-slate-400">Subskrypcja miesięczna lub dłuższa – bez zobowiązań na lata. Możesz zrezygnować w panelu.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 md:p-8 text-center backdrop-blur-xl shadow-inner">
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              <strong className="text-white">Dlaczego warto?</strong> Trenujący z nami handlowcy raportują wyższą skuteczność w realnych rozmowach. 
              Trening z symulowanym klientem AI pozwala popełniać błędy bez konsekwencji i powtarzać scenariusze do skutku.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

