import type { Metadata } from "next";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress-context";
import { SubscriptionProvider } from "@/lib/subscription-context";
import StarryBackground from "@/components/StarryBackground";

export const metadata: Metadata = {
  title: "Sztuka sprzedaży | Trening sprzedaży B2B/B2C z AI",
  description: "Trenuj umiejętności handlowe z AI. Symulator rozmów sprzedażowych B2B i B2C.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-black text-slate-100 antialiased" suppressHydrationWarning>
        <StarryBackground />
        <div className="relative z-10">
          <SubscriptionProvider>
            <ProgressProvider>{children}</ProgressProvider>
          </SubscriptionProvider>
        </div>
      </body>
    </html>
  );
}
