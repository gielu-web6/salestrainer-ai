# Konfiguracja kluczy API – bot Gemini

Aby **bot w treningu (czat + feedback)** działał, musisz podać klucz API Google Gemini.

## Krok 1: Weź klucz API

1. Wejdź na **Google AI Studio**: https://aistudio.google.com/
2. Zaloguj się kontem Google.
3. W menu wybierz **"Get API key"** / **"Utwórz klucz API"** (lub "API keys").
4. Utwórz nowy klucz i **skopiuj go**.

(Uwaga: jeśli w oryginalnym kodzie był "Google Cloud", możesz też użyć klucza z konsoli Google Cloud – w projekcie używamy tego samego klucza co w AI Studio, o ile włączysz Generative Language API.)

## Krok 2: Gdzie wkleić klucz w projekcie

1. W **głównym folderze projektu** (tam gdzie jest `package.json`) utwórz plik **`.env.local`** (jeśli go nie ma).
2. Wklej do niego linię (podstawiając swój klucz). **Nazwa zmiennej** musi być dokładnie:

```env
GOOGLE_GENAI_API_KEY=twój_skopiowany_klucz
```

(lub `GOOGLE_GENERATIVE_AI_API_KEY` – obie nazwy są obsługiwane.)

3. **Nie commituj** pliku `.env.local` do gita. **Nie używaj** `NEXT_PUBLIC_GOOGLE_GENAI_API_KEY` – to by udostępniło klucz w przeglądarce. Klucz jest używany tylko w Route Handlerze (backend).

## Krok 3: Uruchom aplikację i restart po zmianie env

```bash
npm run dev
```

**Ważne:** Next.js **nie ładuje zmian w `.env.local` w locie**. Po każdej edycji `.env.local` musisz **zrestartować serwer** (Ctrl+C, potem ponownie `npm run dev`).

W terminalu przy pierwszym wywołaniu czatu zobaczysz np. `DEBUG: Key exists: true` – jeśli jest `false`, klucz nie dociera (sprawdź nazwę pliku i restart).

---

**Podsumowanie:** klucz w **`.env.local`** jako `GOOGLE_GENAI_API_KEY=...` (lub `GOOGLE_GENERATIVE_AI_API_KEY=...`). Po zmianie env – **restart `npm run dev`**.
