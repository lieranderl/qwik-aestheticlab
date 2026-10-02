# i18n: qwik-speak → compiled-i18n, then Qwik 2

## Goal

Remove the qwik-speak dependency, which blocks the Qwik 2 upgrade (maintainer will only evaluate Qwik v2 after its final release, robisim74/qwik-speak#142), without changing URLs, locale behaviour, rendered copy, or the single-image Cloud Run deployment. Then, in a separate branch and only after approval, upgrade to Qwik 2.

## Scope

- Phase A: this plan and a lossless key-migration script.
- Phase B (`refactor/i18n-compiled-i18n`, Qwik 1.20): library swap, docs, gates.
- Phase C (separate branch, after user approval): Qwik 2 / Vite 8.

## Non-goals

- No UI restyling. `feat/editorial-redesign` is restyling `src/components/**` concurrently; Phase B touches components only at import and translation call sites.
- No URL or SEO changes (`/{locale}/…`, hreflang, `x-default`).
- No locale auto-detection: `/` keeps its `302` to `/en-BE/` (we do not adopt compiled-i18n's `guessLocale`/`301` example).
- No Supabase schema changes; `requestEv.locale()` stays the source for locale-specific columns.

## Current State (audited 2026-10-02)

| Area | Usage |
| --- | --- |
| Call sites | 29 source files import `qwik-speak`; 58 `inlineTranslate()`, 10 `useSpeakLocale`, 2 `useQwikSpeak`/`useSpeakLocale` in `root.tsx` |
| Catalog | `i18n/{en-BE,nl-BE,fr-BE,ru-BE,uk-BE}/app.json` (nested, 261 keys; non-en also carry stale top-level `dates`/`numbers`); `runtime.json` empty in all locales |
| Keys used in source | 193 (all present in all five locales); 68 keys in JSON are unused |
| Interpolation | One key: `app.reviews.rating_label` with `{{rating}}`/`{{max}}` |
| HTML in values | FAQ answers, rendered through `dangerouslySetInnerHTML` |
| Special characters | No `$`, backtick, backslash, or newline in any value |
| Dynamic keys | None. `src/shared/nav-links.ts` passes keys as data; `navigation.tsx` maps them through literal `t()` calls |
| Locale plumbing | `src/routes/plugin.ts` (`validateLocale`, `setSpeakContext`, `locale()`); `[...lang]/layout.tsx` 404s unsupported locales; `src/routes/index.tsx` `302 → /en-BE/`; `entry.ssr.tsx` `base: /build/{locale}` and `lang`; `root.tsx` `<body lang>` |
| Build | `qwikSpeakInline` already emits per-locale client chunks under `/build/{locale}/` |
| Config consumers | `speak-config.ts` → `router-head`, `language-switcher`, `locale-navigation`, `layout`, `plugin`, `index`, `entry.ssr`, `root` |
| Tests | `e2e/home.spec.ts` asserts localized hero/reviews/FAQ copy for all five locales against `bun run dev`; `nav-links.spec.ts` asserts `@@` keys |

## Decision: compiled-i18n 1.3.0 (not an in-house runtime)

| Criterion | compiled-i18n | In-house JSON + context + typed `t()` |
| --- | --- | --- |
| Client JS | Zero runtime: tagged templates are replaced with string literals per locale | Dictionary must reach the client: serialized into every page's Qwik state or lazy-loaded via `server$` (qwik-speak's non-inline mode) |
| Build shape | Per-locale client copies under `/build/{locale}/` — identical to today's `qwikSpeakInline` output and existing `extractBase` | One client build (simpler), but larger HTML/requests |
| SSR | All locales in memory; locale resolved per call from Qwik's `getLocale()` (request-scoped invoke context, `withLocale` for `head`) | Same, via context |
| Cloud Run | Still one image; server bundles all catalogs; client has 5 asset trees (as today) | One image |
| Qwik 2 | Core is framework-agnostic; only the optional `compiled-i18n/qwik` helper imports `@builder.io/qwik`. We do not use that helper, so Qwik 2 needs only our own glue to import `getLocale` from `@qwik.dev/core` | We own it all |
| Type safety | Keys are untyped strings → enforced by a catalog unit test | `keyof` catalog typing possible |
| Cost/risk | Single maintainer (Qwik core member); Babel at build time; dev uses runtime lookups while prod inlines, so prod build needs a smoke check | Own code to maintain, plus a design for client delivery and `head` |

**Pick compiled-i18n**: it preserves today's delivery model one-to-one, which makes this a library swap rather than an architecture change. The in-house option only wins on key typing, and a unit test recovers most of that.

### Conventions after migration

- Keys keep the existing dotted IDs minus the redundant `app.` prefix: `t("app.nav.home@@Home")` → `` _`nav.home` ``. English text lives in `i18n/en-BE.json`; there is no inline default anymore.
- Interpolation uses positional placeholders. Codemod and migration both derive the order from the en-BE value: `t("app.reviews.rating_label@@…", { rating, max })` → `` _`reviews.rating_label ${rating} ${max}` `` with key `reviews.rating_label $1 $2` and value `$1 out of $2 stars`.
- Files: `i18n/{locale}.json` in compiled-i18n format `{ locale, fallback, name, translations }`. Non-en locales use `fallback: "en-BE"`, which matches qwik-speak's behaviour of falling back to the English default. Keys are sorted with the plugin's comparator, so builds cause no churn.
- Locale in components: `getCurrentLocale()` from `src/shared/i18n.ts` (wraps Qwik `getLocale(defaultLocale)`; reads `q:locale` on the client). It replaces `useSpeakLocale().lang`.
- Config: `src/speak-config.ts` → `src/i18n-config.ts`, same `config` shape (`defaultLocale.lang`, `supportedLocales[].lang`), framework-free so `vite.config.ts` can import it.

## Key-Migration Script

`scripts/i18n-migrate-from-qwik-speak.ts` (Bun, no new deps):

1. Reads `i18n/{locale}/app.json` for all five locales and flattens them.
2. Scans `src/` for `"app.<key>@@` literals to find the used keys, and fails if any used key is missing in any locale.
3. Converts keys (strip `app.`; append `$1 … $n` (space-separated) for `{{param}}` keys, ordered by first appearance in en-BE) and values (`$` → `$$`, `{{param}}` → `$n`).
4. Rejects values that would break inlining: newlines in keys, backticks, or `${`.
5. **Round-trip check**: for every locale × used key, it reverses the conversion and asserts it is byte-identical to the original value. The script aborts on any mismatch.
6. Prunes unused keys by default (`--keep-unused` keeps them) and prints the pruned list.
7. Writes `i18n/{locale}.json`.
8. `--codemod [files…]` rewrites call sites: `t("app.k@@…")` → `` _`k` ``, parameterised calls, and `inlineTranslate()` declarations and imports. It is idempotent, so `feat/editorial-redesign` can run it on its own files after rebasing.

## Phases

### Phase A — Plan and migration script

- [x] Audit usage (table above).
- [x] Decision and conventions.
- [x] Migration script with a round-trip check: 965 translations (193 keys × 5 locales) round-trip byte-for-byte; 70 dead keys pruned (68 `app.*` with no source reference, plus stale top-level `dates`/`numbers` in non-en locales).
- Gate: script runs clean; `markdownlint --disable MD013 -- plans/i18n-compiled-i18n-and-qwik2.md`.

### Phase B — Swap library on Qwik 1.20 (`refactor/i18n-compiled-i18n`)

1. `bun add -d compiled-i18n@1.3.0`; `bun remove qwik-speak`.
2. Run the migration script and delete `i18n/*/app.json` and `runtime.json`.
3. `vite.config.ts`: replace `qwikSpeakInline` with `i18nPlugin({ locales, defaultLocale, assetsDir: "build/", addMissing: !process.env.CI })`, also enabled in test mode so virtual modules resolve.
4. `entry.ssr.tsx`: `setLocaleGetter(() => getLocale(defaultLocale))`; keep the existing `extractBase` and `lang`.
5. `plugin.ts`: drop `validateLocale`/`setSpeakContext`; keep the supported-locale check, the default fallback, and `locale(lang)`.
6. `root.tsx`: drop `useQwikSpeak`; `<body lang={getCurrentLocale()}>`.
7. Run the codemod on all call sites; replace `useSpeakLocale` by hand (10 sites); update `nav-links.ts` keys and spec.
8. Delete `speak-functions.ts`; rename the config; remove `qwik-speak-inline.log` from `.gitignore`.
9. Add `i18n.extract` (`I18N_PRUNE=1 vite build`: add missing and prune unused) and `i18n.check` scripts.
10. Add a catalog unit test (`src/shared/i18n-catalog.spec.ts`): identical key sets across the five locales, non-empty values, identical `$n` placeholder sets, every source key present, and no unused keys.
11. Docs: `.github/I18N_GUIDE.md` (rewrite), `AGENTS.md` (command table, conventions), `README.md`, `REVIEW.md`, `.github/COMPONENT_GUIDE.md`, `.github/CODING_STANDARDS.md`, `.github/DEPLOYMENT.md`, `.agents/skills/qwik-aesthetic-core/SKILL.md`.

Gate:

- `bun run verify` green.
- `bun run test.e2e` green (dev mode, all five locales).
- Production smoke (the inlined path is not covered by e2e): `bun run build && bun run serve` with mock Supabase. Then `curl` `/`, `/nl-BE/`, `/uk-BE/pricelist/`, check `302`/`200`, translated copy, `<html lang>`, `q:locale`, and `/build/{locale}/` chunk references. Grep `dist/build/nl-BE/` for Dutch strings and confirm no `__$LOCALIZE$__` remains.

Results (2026-10-02):

- `bun run verify`: green (108 unit tests; coverage above thresholds; client and server builds).
- `bun run test.e2e`: 23/23 on Chromium against the dev server. Firefox and WebKit are not installed in the agent sandbox, so CI must cover them.
- The same 23 specs pass against the **production** server (inlined bundles) with mock Supabase.
- Rendered SSR text and translatable attributes (`alt`, `aria-label`, `title`, `content`) on `/`, `/pricelist/`, `/privacy-policy/`, and `/notice/` for all five locales are identical to a baseline build of `fd5d671`. Review cards are masked because they are randomly sampled per request.
- `/` → `302 /en-BE/`; `/de-DE/` → `404`; `<html lang>`, `q:locale`, and `q:base=/build/<locale>/` are correct per locale. A client re-render on `/uk-BE/` shows Ukrainian strings and loads only `/build/uk-BE/` chunks.
- `i18n.extract` workflow verified: a temporary key was added as `""` in all five catalogs, the unused key was pruned, and `i18n.check` failed until the catalogs were restored.

### Phase C — Qwik 2 (separate branch, only after B is merged and the user approves)

Facts as of 2026-10-02 (npm):

- `@qwik.dev/core` / `@qwik.dev/router` `latest` = `2.0.0-rc.0` — **not final**. Decide whether to ship on an RC or prepare the branch and wait.
- `@qwik.dev/core` peers: `vite >=8 <9`, **`vitest >=2 <5`**. This conflicts with the pinned Vitest 5.0.3. Options: (a) downgrade to Vitest 4.x and `@vitest/coverage-v8` 4.x; (b) keep Vitest 5 and override the peer warning (unit tests only touch `src/shared`, which does not import Qwik), with risk; (c) wait for a core release that widens the range. Recommend (a) unless the next RC widens it.
- Vite `latest` = 8.3.2; Vitest 5 supports Vite 8.
- compiled-i18n: Qwik glue is ours (`entry.ssr.tsx`, `src/shared/i18n.ts`), so the switch is an import path change.

Steps: follow <https://qwik.dev/docs/upgrade/> (`npx @qwik.dev/cli migrate-v2`, which renames `@builder.io/qwik*` → `@qwik.dev/*`, `qwik-city` → `router`, `QwikCityProvider` → `QwikRouterProvider`, and similar). Remove the `@builder.io/qwik` override, check `@qwikest/icons` Qwik 2 compatibility, check `useVisibleTask$`/`useTask$` semantics, and check the `server$` and `routeLoader$` serialization changes.

Gate: the same as Phase B, plus a manual browser check of interactive islands (booking modal, gallery lightbox, language switcher, mobile nav).

## Commit Strategy

Only when the user asks. Suggested commits: (1) plan and script; (2) catalog migration; (3) code swap and codemod; (4) docs. Use the `Co-Authored-By` footer from `AGENTS.md`.

## Rebase Coordination with `feat/editorial-redesign`

- Component diffs are limited to the import line, the removal of `const t = inlineTranslate();`, and call sites `t("app.x@@…")` → `` _`x` ``.
- On conflict, take their version of the file and re-run `bun scripts/i18n-migrate-from-qwik-speak.ts --codemod <file>`. If they added new keys, re-run the catalog migration from their `app.json`, or add the keys to the five `i18n/{locale}.json` files.

## Verification

- `markdownlint --disable MD013 -- plans/i18n-compiled-i18n-and-qwik2.md`
- `bun run verify`
- `bun run test.e2e`
- Production smoke as described above.
