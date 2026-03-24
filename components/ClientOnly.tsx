"use client";

import { useState, useEffect } from "react";

/**
 * Renderuje dzieci tylko po zamontowaniu po stronie klienta.
 * Zapobiega błędom hydracji przy dynamicznych treściach (daty, losowe wartości, ikony).
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <>{fallback}</>;
  return <>{children}</>;
}
