# i18n Guide — compiled-i18n Patterns

This project uses [compiled-i18n](https://github.com/wmertens/compiled-i18n) for UI strings. At build time, translations are inlined into a separate client build for each locale. On the server, they are resolved per request from in-memory catalogs. No translation runtime or catalog is shipped to the browser.

## Supported Locales

| Locale | Language | Region |
| --- | --- | --- |
| `en-BE` | English | Belgium (default) |
| `ru-BE` | Russian | Belgium |
| `nl-BE` | Dutch | Belgium |
| `fr-BE` | French | Belgium |
| `uk-BE` | Ukrainian | Belgium |

Default locale: `en-BE` · Currency: `EUR` · Timezone: `Europe/Brussels`.

Configuration lives in `src/i18n-config.ts`. Keep it framework-free, because `vite.config.ts` imports it.

## Translation Files

```text
i18n/
├── en-BE.json   # source of English text
├── nl-BE.json
├── fr-BE.json
├── ru-BE.json
└── uk-BE.json
```

Each file uses the compiled-i18n format, with flat keys sorted by the plugin:

```json
{
  "locale": "nl-BE",
  "fallback": "en-BE",
  "name": "Nederlands",
  "translations": {
    "nav.home": "Home",
    "reviews.rating_label $1 $2": "$1 van $2 sterren"
  }
}
```

- Non-default locales set `fallback: "en-BE"` as a runtime safety net. The catalog test still requires every key in every locale.
- Values may contain HTML only where the call site renders it via `dangerouslySetInnerHTML` (the FAQ answers).
- Values must not contain a backtick or `${`, because they are inlined into template literals. Write a literal `$` as `$$`.

## Using Translations

```tsx
import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";

export const MyComponent = component$(() => (
  <h1>{_`section.title`}</h1>
));
```

- Always use the **tagged template** form `` _`key` ``, with `_` imported directly from `compiled-i18n`. Only tagged templates are inlined; calling `_("key")` or re-exporting `_` from a helper is not.
- Keys must be static. For data-driven lists (e.g. `src/shared/nav-links.ts`), map each key to a literal `` _`key` `` at the call site.
- `_` works anywhere: components, route `head` exports, and plain functions called during render.
- There is no inline default anymore. English text lives in `i18n/en-BE.json`, and a missing key renders the key itself.

### Parameters

Interpolations become positional placeholders `$1`, `$2`, … in key order:

```tsx
_`reviews.rating_label ${rating} ${max}`
// key:   "reviews.rating_label $1 $2"
// value: "$1 out of $2 stars"
```

Translators may reorder placeholders, but each locale must use the same placeholder set as `en-BE`.

### Current Locale

Use `getCurrentLocale()` from `~/shared/i18n` (e.g. for `Intl.NumberFormat`). It returns the request locale during SSR and the container's `q:locale` in the browser. Do not read `currentLocale` from compiled-i18n on the server, because it is shared across concurrent requests.

## Key Naming

`<section>.<element>` in `snake_case`, e.g. `nav.home`, `services.view_full`, `faq.booking.question`, `head.home.title`.

1. Use the section or domain as the first segment (`nav`, `hero`, `services`, `book`, `contact`, `team`, `footer`, `cookies`, `common`, `privacy`, `notice`, `head`, …).
2. Reuse `common.*` keys for strings shared across sections (e.g. `common.close`).
3. Keep keys descriptive. To change English copy, edit the value in `en-BE.json` and keep the key.

## Workflow

| Task | Command |
| --- | --- |
| Add missing / prune unused keys in all five catalogs | `bun run i18n.extract` |
| Check catalogs (also part of `bun run test`) | `bun run i18n.check` |

1. Add `` _`section.new_key` `` in code.
2. Run `bun run i18n.extract`. A production client build appends `"section.new_key": ""` to every `i18n/<locale>.json` and removes keys no longer used in `src/`.
3. Fill in the value in **all five** files (English in `en-BE.json`).
4. Run `bun run i18n.check`. `src/shared/i18n-catalog.spec.ts` fails if any locale has missing, extra, or empty keys, or placeholders that differ from `en-BE`.

In CI (`CI` set), builds never write to `i18n/`. Missing keys are only logged, and the catalog test fails.

## Locale Routing

| File | Responsibility |
| --- | --- |
| `src/routes/index.tsx` | `302` from `/` to `/en-BE/` |
| `src/routes/plugin.ts` | Sets Qwik's request locale from `params.lang` (default when unsupported) |
| `src/routes/[...lang]/layout.tsx` | `404` for unsupported locale prefixes; locale-aware `routeLoader$`s |
| `src/entry.ssr.tsx` | `setLocaleGetter(() => getLocale(...))`, `<html lang>`, and the per-locale asset base `/build/<locale>/` |
| `src/components/ui/language-switcher.tsx` | Full-page `<a>` navigation between locale prefixes (each locale has its own client bundle) |

## Locale-Specific Database Fields

Supabase stores content in suffixed columns (`name`, `name_ru`, `name_nl`, `name_fr`, `name_uk`; the unsuffixed column is English). Loaders in `src/routes/[...lang]/layout.tsx` pass `requestEv.locale()` to `src/shared/supabase-data.ts`, which selects only that locale's columns (`serviceColumns`, `staffColumns`, …) and projects them via `src/shared/locale-content.ts`. Never select or map locale columns in UI components.

## Adding a New Supported Locale

1. Add it to `supportedLocales` in `src/i18n-config.ts`. Vite, routing, the language switcher, hreflang, and the catalog test all derive from this list.
2. Create `i18n/<locale>.json` with `locale`, `fallback: "en-BE"`, `name`, and all keys translated.
3. If Supabase content is localized: add the columns, then extend `src/shared/locale-content.ts` / `supabase-data.ts` and `src/types.ts`.
4. Add the locale to the localized-copy assertions in `e2e/home.spec.ts`.

## Dev vs Production

- **Dev** (`bun run dev`): translations are looked up at runtime on both server and client. The client reads the locale from `<html lang>`.
- **Production** (`bun run build`): the client is built once, then copied into `dist/build/<locale>/` with every `` _`…` `` replaced by its string. The server bundles all catalogs. Playwright runs against dev, so check inlining-sensitive changes with a production build (`bun run build && bun run serve`).

## Common Mistakes

| Mistake | Correct approach |
| --- | --- |
| `` _(`key`) `` or `_("key")` | `` _`key` `` |
| Dynamic key `` _`${prefix}.title` `` | One literal key per string |
| Re-exporting `_` from a helper module | Import `_` from `compiled-i18n` in each file |
| Mapping `name_ru` / `name_nl` in UI components | Use the locale-scoped loaders in `layout.tsx` |
| Leaving `""` values after `i18n.extract` | Translate all five locales; `i18n.check` enforces it |
| Hardcoding English strings in JSX | Add a key and use `` _`section.key` `` |
| `<Link>` between locales | Plain `<a href>`: each locale has its own client bundle |
