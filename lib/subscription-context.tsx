"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "salestrainer-is-pro";

interface SubscriptionContextValue {
  isPro: boolean;
  setPro: (value: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function loadIsPro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return raw === "true";
  } catch {
    return false;
  }
}

function saveIsPro(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsPro(loadIsPro());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveIsPro(isPro);
  }, [hydrated, isPro]);

  const setPro = useCallback((value: boolean) => {
    setIsPro(value);
  }, []);

  const value: SubscriptionContextValue = {
    isPro,
    setPro,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

