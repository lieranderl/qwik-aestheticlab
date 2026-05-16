# Minify Build Output

## Goal

Make production JavaScript and CSS minification explicit for the Qwik/Vite build, and enable safe minification for the Bun SSR server bundle.

## Findings

- Qwik uses Vite for the production client build.
- Vite minifies client JavaScript by default with Oxc.
- Vite minifies client CSS by default with Lightning CSS unless client minification is disabled.
- Vite does not minify SSR builds by default.
- `adapters/bun/vite.config.ts` explicitly disables SSR minification with `minify: false`.

## Plan

1. Keep client minification explicit in the base Vite config.
2. Enable production minification for the Bun SSR adapter build.
3. Verify with scoped Biome, type check, unit tests, and production build.

## Trade-Offs

- Minifying SSR output reduces server bundle size and final image payload slightly.
- Minified server code can make stack traces less readable; source maps remain disabled as before.
- Browser-delivered JavaScript and CSS were already minified, so user-facing transfer impact is expected to be minimal.
