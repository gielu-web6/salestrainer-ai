"use client";

import { useState } from "react";

const LOGO_SIZE = 72; // px – między małym (64) a dużym (96)

export default function Logo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-base font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        style={{ width: LOGO_SIZE, height: LOGO_SIZE, minWidth: LOGO_SIZE, minHeight: LOGO_SIZE }}
        aria-hidden
      >
        SA
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Projekt bez nazwy (38).png"
      alt="Sztuka sprzedaży – logo"
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      className="shrink-0 object-contain"
      style={{ width: LOGO_SIZE, height: LOGO_SIZE, minWidth: LOGO_SIZE, minHeight: LOGO_SIZE }}
      onError={() => setFailed(true)}
    />
  );
}
