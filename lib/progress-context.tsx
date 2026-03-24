"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "salestrainer-unlocked-levels";

interface ProgressContextValue {
  unlockedLevels: number[];
  passLevel: (levelId: number) => void;
  isUnlocked: (levelId: number) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadFromStorage(): number[] {
  if (typeof window === "undefined") return [1];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [1];
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) && parsed.includes(1) ? parsed : [1];
  } catch {
    return [1];
  }
}

function saveToStorage(levels: number[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUnlockedLevels(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || unlockedLevels.length === 0) return;
    saveToStorage(unlockedLevels);
  }, [hydrated, unlockedLevels]);

  const passLevel = useCallback((levelId: number) => {
    setUnlockedLevels((prev) => {
      const next = levelId + 1;
      if (prev.includes(next)) return prev;
      return [...prev, next].sort((a, b) => a - b);
    });
  }, []);

  const isUnlocked = useCallback(
    (levelId: number) => {
      if (!hydrated) return levelId === 1;
      return unlockedLevels.includes(levelId);
    },
    [hydrated, unlockedLevels]
  );
  const value: ProgressContextValue = {
    unlockedLevels: hydrated ? unlockedLevels : [1],
    passLevel,
    isUnlocked,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
