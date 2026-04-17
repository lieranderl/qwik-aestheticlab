---
name: i18n-extract-review
description: Use when adding or changing visible UI copy, translation keys, or qwik-speak extraction behavior in Aesthetic Lab.
---

# i18n Extract Review

Read `AGENTS.md` first, then `.github/I18N_GUIDE.md` if the task touches translation-heavy files.

Use this skill when visible text, translation keys, or extraction behavior changes:

- use `inlineTranslate()` inside components
- keep the `key@@Default English Text` pattern
- avoid dynamic translation keys unless absolutely necessary
- run `bun run qwik-speak-extract` after adding or renaming keys
- inspect `qwik-speak-inline.log` if extraction or build warns about missing values or dynamic keys
- keep supported locales synchronized with `src/speak-config.ts` and `package.json`
