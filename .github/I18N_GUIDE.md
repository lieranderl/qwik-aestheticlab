# i18n Guide — Qwik Speak Patterns

This project uses [qwik-speak](https://github.com/nicolo-ribaudo/qwik-speak) for internationalization. This guide documents the exact patterns, workflows, and rules for working with translations.

## Supported Locales

| Locale | Language | Region |
|--------|----------|--------|
| `en-BE` | English | Belgium (default) |
| `ru-BE` | Russian | Belgium |
| `nl-BE` | Dutch | Belgium |
| `fr-BE` | French | Belgium |
| `uk-BE` | Ukrainian | Belgium |

Default locale: `en-BE`
Currency: `EUR`
Timezone: `Europe/Brussels`

Configuration lives in `src/speak-config.ts`.

## Translation Files

```
i18n/
├── en-BE/app.json
├── ru-BE/app.json
├── nl-BE/app.json
├── fr-BE/app.json
└── uk-BE/app.json
```

Each file is a flat JSON object with dot-separated keys:

```json
{
  "app.nav.home": "Home",
  "app.nav.services": "Services",
  "app.hero.slogan": "The Art of Natural Beauty"
}
```

## Using Translations in Components

### Step 1: Import and Initialize

```tsx
import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export const MyComponent = component$(() => {
  const t = inlineTranslate();

  return <h1>{t("app.section.title@@Default English Text")}</h1>;
});
```

### The `@@` Pattern

Every translation call **must** include the `@@` separator with a default English fallback:

```tsx
t("app.key@@Default Text")
```

- The part before `@@` is the translation key (looked up in `app.json` files).
- The part after `@@` is the fallback displayed if the key is missing.
- **Never omit the `@@` fallback** — it serves as both documentation and a safety net.

### Key Naming Convention

Keys follow a hierarchical dot notation:

```
app.<section>.<element>
```

Examples:

| Key | Usage |
|-----|-------|
| `app.nav.home` | Navigation link label |
| `app.hero.slogan` | Hero section tagline |
| `app.services.title` | Services section heading |
| `app.services.subtitle` | Services section subheading |
| `app.book.book_now` | Booking button text |
| `app.contact.location` | Contact section label |
| `app.cookies.title` | Cookie banner heading |
| `app.footer.copyright` | Footer copyright text |
| `app.reviews.title` | Reviews section heading |
| `app.team.title` | Team section heading |
| `app.common.read_more` | Shared UI string |

### Rules for New Keys

1. Always prefix with `app.`.
2. Use the section/domain as the second segment (`nav`, `hero`, `services`, `book`, `contact`, `team`, `about`, `footer`, `cookies`, `common`, `privacy`, `instagram`).
3. Use `snake_case` for the final segment.
4. Keep keys descriptive but concise.
5. Reuse `app.common.*` keys for strings shared across multiple sections (e.g., "Read More", "Close").

## Locale-Specific Database Fields

Supabase tables store content in multiple languages using suffixed columns:

```
name, name_ru, name_nl, name_fr, name_uk
description, description_ru, description_nl, description_fr, description_uk
about, about_ru, about_nl, about_fr, about_uk
```

The **unsuffixed** column is always English.

### Where Locale Mapping Happens

Locale-specific field selection happens **exclusively** in `routeLoader$` functions inside `src/routes/[...lang]/layout.tsx`:

```tsx
const shortlocal = requestEv.locale().split("-")[0];

const localizedName =
  shortlocal === "ru" ? service.name_ru
  : shortlocal === "nl" ? service.name_nl
  : shortlocal === "fr" ? service.name_fr
  : shortlocal === "uk" ? service.name_uk
  : service.name;
```

**Never** perform locale-based field selection inside UI components. Components receive already-localized data via props.

### Adding a New Locale to Database Fields

If a new language needs Supabase support:

1. Add the new column to the Supabase table (e.g., `name_de` for German).
2. Add the mapping branch in the relevant `routeLoader$` in `layout.tsx`.
3. Update `src/types.ts` to include the new field in the interface.

## Adding a New Supported Locale

To add an entirely new locale (e.g., `de-BE`):

### 1. Update Speak Config

`src/speak-config.ts`:

```tsx
supportedLocales: [
  { lang: "en-BE", currency: "EUR", timeZone: "Europe/Brussels" },
  { lang: "ru-BE", currency: "EUR", timeZone: "Europe/Brussels" },
  { lang: "nl-BE", currency: "EUR", timeZone: "Europe/Brussels" },
  { lang: "fr-BE", currency: "EUR", timeZone: "Europe/Brussels" },
  { lang: "uk-BE", currency: "EUR", timeZone: "Europe/Brussels" },
  { lang: "de-BE", currency: "EUR", timeZone: "Europe/Brussels" }, // new
],
```

### 2. Update Vite Config

`vite.config.ts` — add to the `qwikSpeakInline` plugin:

```tsx
qwikSpeakInline({
  supportedLangs: ["en-BE", "ru-BE", "nl-BE", "fr-BE", "uk-BE", "de-BE"],
  defaultLang: "en-BE",
  assetsPath: "i18n",
}),
```

### 3. Create Translation File

Create `i18n/de-BE/app.json` — copy from `en-BE/app.json` and translate all values.

### 4. Update Extract Script

`package.json`:

```json
"qwik-speak-extract": "qwik-speak-extract --supportedLangs=en-BE,nl-BE,fr-BE,ru-BE,uk-BE,de-BE --assetsPath=i18n"
```

### 5. Update Data Loaders

Add locale mapping branches in `src/routes/[...lang]/layout.tsx` for the new short code.

### 6. Update Types

Add new locale-specific fields to `src/types.ts` interfaces if DB columns are added.

## Translation Extraction Workflow

After adding new `t("app.key@@Default")` calls in code:

```bash
bun run qwik-speak-extract
```

This scans the codebase, finds all `@@` keys, and:

- Adds missing keys to all `i18n/<locale>/app.json` files.
- Uses the `@@Default Text` as the value for new keys in `en-BE`.
- Leaves other locales with the English default (must be manually translated).

**Always run extraction before committing** if new translation keys were added.

## Translation in Route Files vs Components

| Location | Method |
|----------|--------|
| Components (`components/sections/*`, `components/ui/*`) | `const t = inlineTranslate();` then `t("key@@Default")` |
| Route page files (`routes/[...lang]/index.tsx`, etc.) | Same — `inlineTranslate()` works everywhere inside `component$` |
| Route loaders (`routeLoader$`) | No translations — loaders deal with raw data. Locale field mapping only. |
| Non-component code (utilities, constants) | Do not use `t()` — pass translated strings from components instead. |

## Build-Time Inlining

The `qwikSpeakInline` Vite plugin inlines translations at build time for each supported locale. This means:

- Translation lookups have zero runtime cost in production.
- All locale JSON files are consumed at build time, not shipped to the client.
- If a translation key is missing from a locale file, the `@@Default` fallback is used.

## Common Mistakes

| Mistake | Correct Approach |
|---------|-----------------|
| `t("app.key")` without `@@` fallback | `t("app.key@@Default Text")` |
| Using `t()` outside `component$` | Pass translated strings as props from a component |
| Mapping `name_ru` / `name_nl` in UI components | Map in `routeLoader$` in `layout.tsx` |
| Forgetting to run extract after adding keys | Run `bun run qwik-speak-extract` |
| Hardcoding English strings in JSX | Wrap with `t("app.section.key@@English Text")` |
| Using backtick template literals inside `t()` | Use params: `t("app.key@@Hello {{name}}", { name: value })` |

## Parameter Interpolation

Qwik Speak supports parameters in translations:

```tsx
t("app.greeting@@Hello {{name}}", { name: userName })
```

In `app.json`:

```json
{
  "app.greeting": "Hello {{name}}"
}
```

Use double curly braces `{{param}}` for interpolation. Keep parameter names descriptive and consistent across locale files.

## Plural Forms

Qwik Speak supports basic plural handling. Prefer keeping plural logic simple:

```tsx
const label = count === 1
  ? t("app.item.singular@@1 item")
  : t("app.item.plural@@{{count}} items", { count });
```

For complex plural rules (Russian, Ukrainian have multiple plural forms), handle branching in the component and use separate keys for each form.