# Performance Optimization Pass

## Goal

Reduce render-path blocking and unnecessary client/network work on the public marketing pages without changing content or core UX.

## Scope

- Delay non-critical third-party work until needed
- Reduce client-side visibility/animation overhead
- Improve image delivery for service and gallery assets
- Tighten font preload and cache behavior for the homepage shell
- Replace heavyweight social embeds with first-party previews when they dominate the render path
- Enable transport compression for text responses
- Resolve user-visible accessibility regressions introduced by low-contrast styling

## Non-Goals

- No content redesign
- No Supabase schema changes
- No analytics event taxonomy changes

## Assumptions

- Marketing content tolerates longer shared-cache freshness than 5 seconds
- Instagram embeds may initialize after the gallery becomes visible instead of on first HTML parse
- Qwik image `?jsx` transforms remain the preferred local pattern for media optimization

## Phases

1. Remove global third-party embed loading from the document root
2. Reuse a single visibility observer for `FadeUp`
3. Move service/gallery asset resolution onto optimized image components
4. Reduce unnecessary font preloads and relax SSR cache settings
5. Replace live Instagram embeds with lightweight local preview cards
6. Enable gzip compression for HTML, CSS, JS, JSON, and SVG responses
7. Fix Lighthouse-reported contrast regressions in reviews, footer, and watermark styling
8. Verify with a fresh production build and inspect emitted assets

## Phase Gates

- Phase 1-4: code review against affected route and component boundaries
- Phase 8: `bun run build`

## Atomic Commits

- One commit for the performance pass after verification

## Verification

- `bun run build`
