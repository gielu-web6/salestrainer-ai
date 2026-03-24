# Sales Assistance — trening sprzedaży B2B/B2C z AI

Aplikacja Next.js (App Router) do treningu umiejętności sprzedażowych z symulowanym klientem AI. Paleta: granat/slate/zinc, bez gamifikacji.

## Wymagania

- Node.js 18+
- Klucz API Anthropic (model: `claude-3-5-sonnet-20240620`)

## Konfiguracja

1. Skopiuj plik z przykładowymi zmiennymi:
   ```bash
   cp .env.example .env.local
   ```
2. W `.env.local` ustaw:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja: [http://localhost:3000](http://localhost:3000).

## Struktura

| Ścieżka | Opis |
|--------|------|
| `/` | Landing page, CTA „Zacznij trening” |
| `/dashboard` | Lista 5 poziomów; 2–5 odblokowane po zaliczeniu poprzedniego (progres w `localStorage`) |
| `/training/[levelId]` | Ekran rozmowy (czat) z hookiem `useChat`, stream z API |
| `/feedback` | Podsumowanie po rozmowie: ❌ Błąd, ⚠️ Na granicy, ✅ Dobrze, ocena, komentarz |

## API

- **POST `/api/chat`** — streamowana rozmowa. Body: `{ messages, levelId }`. Dla każdego `levelId` używany jest inny system prompt (łagodny → trudny klient).
- **POST `/api/feedback`** — ocena rozmowy. Body: `{ messages, levelId, lang? }`. Zwraca JSON: `bad`, `borderline`, `good`, `comment`, `score` (1–100), `nextLevel` (boolean). Schemat wymuszony przez `generateObject` + Zod.

## Technologie

- Next.js 15 (App Router), React 18, TypeScript
- Tailwind CSS
- Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/anthropic`)
- Zod (schemat feedbacku)
