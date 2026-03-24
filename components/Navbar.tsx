"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const SCROLL_THRESHOLD = 48;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  if (!isMounted) {
    return (
      <header className="fixed left-0 right-0 z-50 mx-auto mt-4 w-[95%] max-w-6xl" role="banner">
        <nav className="flex items-center justify-between gap-6 rounded-full border border-white/20 px-6 py-3 bg-black/60 backdrop-blur-xl md:px-8">
          <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`fixed left-0 right-0 z-50 mx-auto mt-4 w-[95%] max-w-6xl transition-all duration-300 ${
        scrolled ? "scale-[0.98] opacity-95" : "scale-100 opacity-100"
      }`}
      role="banner"
    >
      <nav
        className={`flex items-center justify-between gap-6 rounded-full border border-white/20 px-6 py-3 shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-xl transition-all duration-300 md:gap-8 md:px-8 ${
          scrolled ? "bg-black/50" : "bg-black/60"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-xl text-white tracking-tight drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] md:text-2xl"
            aria-label="Sztuka sprzedaży – strona główna"
          >
            <span className="drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]">
              <Logo />
            </span>
            <span className="drop-shadow-[0_0_14px_rgba(139,92,246,0.35)]">
              Sztuka{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-light">
                sprzedaży
              </span>
            </span>
          </Link>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-4 md:flex md:gap-6">
          <Link
            href="#funkcje"
            className="px-2 text-sm font-medium tracking-wide text-slate-300 transition-all duration-200 hover:scale-105 hover:text-purple-300"
          >
            Funkcje
          </Link>
          <Link
            href="/pricing"
            className="px-2 text-sm font-medium tracking-wide text-slate-300 transition-all duration-200 hover:scale-105 hover:text-purple-300"
          >
            Cennik
          </Link>
          <Link
            href="#osiagniecia"
            className="px-2 text-sm font-medium tracking-wide text-slate-300 transition-all duration-200 hover:scale-105 hover:text-pink-300"
          >
            Osiągnięcia
          </Link>
          <Link
            href="/dashboard"
            className="px-2 text-sm font-medium tracking-wide text-slate-300 transition-all duration-200 hover:scale-105 hover:text-white"
          >
            Panel
          </Link>
        </div>

        <div className="flex shrink-0 items-center">
          <Link
            href="/dashboard"
            className="navbar-cta-gradient relative overflow-hidden rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] md:px-5 md:py-2.5 md:text-base"
          >
            <span className="relative z-10">Zacznij trening</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
