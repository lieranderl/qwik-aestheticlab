# Coding Standards

## Qwik Component Authoring

### Component Declaration

Every component uses `component$` — no exceptions.

```tsx
import { component$ } from "@builder.io/qwik";

export const MyComponent = component$<MyComponentProps>((props) => {
  // ...
});
```

- Export components as named exports, not default (except route page components which use `export default`).
- Define a `Props` interface above or inline via the generic: `component$<Props>`.
- Destructure props in the function signature when the prop count is manageable (≤5).

### Reactivity

| Need | Use |
| --- | --- |
| Single mutable value | `useSignal<T>(initial)` |
| Derived/computed value | `useComputed$(() => ...)` |
| Side effect on signal change | `useTask$(({ track }) => { track(() => sig.value); ... })` |
| Client-only DOM/browser API | `useVisibleTask$` (last resort — add `biome-ignore` with reason) |
| Shared cross-component state | `useContext` / `createContextId` |

Never use `useState`, `useEffect`, `useRef`, or any React hook — they do not exist in Qwik.

### Serialization Boundaries

Qwik serializes state across server/client. Keep these rules:

- Functions passed to JSX event handlers must be wrapped with `$()`.
- Objects stored in signals must be serializable (no class instances, DOM nodes, or functions unless wrapped).
- `useTask$` closures auto-track signals accessed within `track()`.

### Lazy Loading

Qwik auto-splits at `$` boundaries. Do not:

- Eagerly import large libraries at the top of a component file unless they are needed at render time.
- Use dynamic `import()` manually — Qwik's optimizer handles code splitting.

## TypeScript

- Strict mode is enabled — do not use `// @ts-ignore` or `// @ts-nocheck`.
- Prefer `interface` over `type` for object shapes.
- Use `unknown` over `any`. If `any` is unavoidable, add a `biome-ignore` comment with justification.
- Use the `~/` path alias for all project imports: `import { Thing } from "~/shared/thing";`
- No unused imports or variables — Biome enforces this.

## File & Folder Naming

| Type | Convention | Example |
| --- | --- | --- |
| Components | `kebab-case.tsx` | `service-card.tsx` |
| Utilities/shared | `kebab-case.ts` | `locale-navigation.ts` |
| Types | `kebab-case.ts` or single `types.ts` | `types.ts` |
| Routes | Directory-based (Qwik City) | `routes/[...lang]/pricelist/index.tsx` |
| Translation assets | `<locale>/app.json` | `i18n/en-BE/app.json` |

## Formatting (Biome)

The project uses Biome exclusively — not ESLint or Prettier.

- **Indentation:** Tabs
- **Semicolons:** Always
- **Trailing commas:** Always
- **Quotes:** Double
- **JSX quotes:** Double
- **Line width:** 80
- **Line endings:** LF

Run `bun run biome` to auto-fix. Husky + lint-staged runs this on commit.

## Import Order

Group imports in this order with a blank line between groups:

1. Qwik framework (`@builder.io/qwik`, `@builder.io/qwik-city`)
2. Third-party libraries (`qwik-speak`, `luxon`, etc.)
3. Project aliases (`~/components/...`, `~/shared/...`, `~/types`)
4. Relative imports (`./`, `../`)
5. Asset imports (`~/media/...?jsx`)

## Error Handling

- `routeLoader$` functions must catch errors, log with `console.error`, and return safe defaults (`[]`, `null`).
- Never let a loader throw — it breaks the entire page render.
- UI components receiving nullable data should handle `null`/`undefined` gracefully (early return or fallback UI).

## Event Handlers

```tsx
// Inline — wrap with $()
<button onClick$={$(() => { doThing(); })}>Click</button>

// Or define above JSX
const handleClick = $(() => { doThing(); });
<button onClick$={handleClick}>Click</button>
```

Never pass a bare function without `$()` to a Qwik event handler prop.

## CSS & Styling Rules

- Use Tailwind utility classes as the primary styling method.
- Use DaisyUI component classes before writing custom CSS.
- If custom CSS is needed, add it to `src/global.css` inside an `@layer components` or `@layer utilities` block.
- Never use inline `style` attributes for colors — use theme tokens.
- Exception: CSS custom properties for dynamic values (e.g., `--fade-duration`) in `style` attributes are acceptable.
- Responsive: mobile-first (`base` → `md:` → `lg:` → `xl:`).

## Testing Expectations

The project uses Vitest for unit/component tests and Playwright for E2E tests:

- Place test files adjacent to the module they test: `service-utils.test.ts` next to `service-utils.ts`.
- Run focused tests with `bunx vitest run path/to/file.test.ts`.
- Test utilities and shared logic first; snapshot-test components only when layout stability matters.

## Design Principles

These five principles drive every code decision. When in doubt, refer here first.

### 1. Separation of Concerns

Keep **data access**, **business logic**, and **UI rendering** in distinct layers:

| Layer | Where | Owns |
| --- | --- | --- |
| Data | `routeLoader$` in route/layout files | Supabase queries, locale projection, error handling |
| Logic | `src/shared/` | Pure helpers, validation, service utilities |
| UI | `src/components/` | Rendering, styling, animation — receives data via props only |

- Components never query Supabase or read `event.env`.
- Route files own composition — sections don't import other sections.
- Shared modules are pure functions with typed inputs/outputs.

### 2. KISS — Keep It Simple

Prefer the simplest solution that meets the requirement:

- DaisyUI component classes before custom CSS.
- `useSignal` / `useComputed$` before external state libraries.
- Props before context for component data flow.
- Inline event handlers before extracting to named functions (unless reused).
- One component per file unless a tightly coupled sub-component is ≤ 30 lines.

If a solution feels complex, it probably is. Simplify before shipping.

### 3. Secure by Default

Assume every request is untrusted until proven otherwise:

- **Server-side validation** — `src/shared/supabase-data.ts` validates every Supabase row at runtime before projecting to view models. Never cast raw DB results to interfaces.
- **Least privilege** — Only `anon` / `sb_publishable_*` keys in application runtimes. `service_role` and `sb_secret_*` keys are rejected at startup.
- **Secrets** — Never in source, logs, image layers, plans, or CLI arguments. Accessed only via `event.env.get()` on the server.
- **Headers** — `security-headers.ts` applies CSP, HSTS, referrer policy, and frame protections to every response.

### 4. Fail Fast

Surface configuration and data errors at the earliest possible point:

- `runtime-config.ts` validates `SUPABASE_URL` and `SUPABASE_KEY` format at startup.
- `supabase-data.ts` rejects malformed rows silently (returns `[]`) rather than passing garbage downstream.
- `routeLoader$` functions never throw — they catch errors, log via `logServerEvent`, and return safe defaults (`[]`, `null`).
- Health/dependency endpoints (`/healthz`, `/readyz`, `/dependencyz`) let Cloud Run detect failures before serving traffic.

### 5. DRY — Extract Genuine Repetition

Extract logic when it's **the same thing in three or more places**, or when two copies have already diverged:

- **Do extract:** Identical formatting functions, category resolution switches, locale-field mapping.
- **Don't extract:** Two call sites that happen to look similar but serve different contexts or will likely diverge.
- Shared logic lives in `src/shared/` or `src/consts.ts`. Avoid `utils.ts` catch-alls — name files after their domain.
- When extracting, keep the abstraction at the same level of generality as the call sites. A shared function that takes 8 parameters to cover every edge case is worse than two 4-parameter local helpers.

> Some duplication is better than the wrong shared abstraction. Let patterns stabilize across 3+ uses before abstracting.

## Web Design Principles

These five principles guide every visual and interaction decision. They build on the DaisyUI design system and the project's custom utility classes.

### 1. Typography Hierarchy

The project uses a two-font system with a clear typographic scale. Every new component must fit into this hierarchy:

| Role | Class | Font | Size | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| Display heading | `section-heading` | `font-qestero` | `text-4xl md:text-5xl` | — | Section titles (`h2`) |
| Body lead | `section-lead` | `font-montserrat` | `text-[0.9375rem] md:text-base` | — | Section subtitles/descriptions |
| Section label | `editorial-kicker` | `font-montserrat` | `text-xs md:text-sm` | `font-semibold` | Above-heading labels |
| Card heading | — | `font-qestero` | `text-2xl md:text-3xl` | — | Card titles (`h3`) |
| Body text | — | `font-montserrat` | `text-sm` / `text-base` | — | Paragraphs, descriptions |
| UI labels | — | `font-montserrat` | `text-xs` / `text-sm` | `font-semibold` / `font-medium` | Badges, buttons, meta |

**Rules:**
- `font-qestero` is for display/heading text only — never for body copy or UI labels.
- `font-montserrat` is for everything else: body, buttons, badges, navigation.
- Card headings use `text-balance` + `leading-none` for consistent multi-line wrapping.
- Body text uses `text-pretty` + `leading-relaxed` for readability.
- Never mix serif and sans-serif within a single text element.

### 2. Consistency

The project defines reusable utility classes that enforce visual consistency. Always compose from these before writing one-off styles:

| Class | Purpose | Example |
| --- | --- | --- |
| `custom-container` | Max-width wrapper with responsive padding | Every section's outer div |
| `section-shell` | Vertical rhythm + scroll offset | Every `<section>` |
| `surface-card` | Elevated container with border + shadow | Cards, detail panels, info blocks |
| `editorial-kicker` | Small uppercase label above headings | Section eyebrow text |
| `editorial-rule` | Thin decorative divider | Below section headings |
| `section-heading` | Primary section title | Every `h2` |
| `section-lead` | Subtitle/description paragraph | Below section headings |
| `interactive-media` | Hover scale effect for images | Card images, gallery |
| `scroll-fade-x` | Horizontal scroll with fade edges | Reviews carousel |
| `scrollbar-none` | Hide scrollbar | Horizontal scroll containers |

**Rules:**
- Every `<section>` must use `section-shell`.
- Every section's content wrapper must use `custom-container`.
- Elevated/card containers must use `surface-card` — never ad-hoc border+shadow+rounded combinations.
- If you find yourself repeating the same 3+ Tailwind classes across components, promote them to a utility class in `global.css`.
- Button variants: `btn-primary` (filled) for primary CTAs, `btn-outline btn-primary` for secondary actions. Never mix these roles within the same view.

### 3. Accessibility-First Design

Accessibility is not an afterthought — it's baked into every component from the start:

- **Semantic HTML** — Use `<nav>`, `<section>`, `<article>`, `<dialog>`, `<header>`, `<footer>`, `<main>`.
- **Screen reader text** — Use `sr-only` class for text that should be read by assistive technology but not visually displayed (section labels, loading states).
- **ARIA attributes** — Every interactive component must have appropriate `aria-label`, `aria-expanded`, `aria-controls`, `aria-modal`, `aria-labelledby`, or `aria-describedby`.
- **Focus management** — All interactive elements must show `focus-visible` outlines (already set globally to `2px solid var(--color-primary)`). Modals and menus must trap focus and return it on close.
- **Reduced motion** — All animations and transitions must respect `prefers-reduced-motion: reduce`. The global CSS already handles this for `.fade-motion`, `html`, and `.interactive-media`. New animations must add a `motion-reduce:` variant.
- **Touch targets** — Minimum 44×44px (`min-h-11 min-w-11`) for all interactive elements.
- **Color contrast** — Use semantic DaisyUI tokens (`text-base-content`, `text-primary`, `text-base-content/80`). Never hardcode text colors — tokens are pre-vetted for contrast.
- **`alt` text** — Every `<img>` and `?jsx` image component must have a meaningful `alt` attribute. Decorative images use `aria-hidden="true"` on the parent.

### 4. Responsive Design

All components are built mobile-first and progressively enhanced:

- **Class ordering** — Always base (mobile) → `sm:` → `md:` → `lg:` → `xl:`. Never desktop-first.
- **Breakpoints** — `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px` (Tailwind defaults).
- **Grid collapse** — `grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4`. Content determines the column count, not arbitrary layout preferences.
- **Safe areas** — Always account for device notches and home indicators with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` on fixed/sticky elements.
- **Navigation** — Desktop shows horizontal menu + language switcher; mobile shows hamburger + fullscreen overlay. The breakpoint is `lg:` (1024px).
- **Images** — Provide `sizes` attribute on all `<img>` elements for responsive loading. Use `loading="lazy"` except for LCP (hero) images.
- **Typography scale** — All font sizes must have a smaller mobile default and a `md:` or `lg:` increase.
- **Test at** — 375px (iPhone SE), 768px (iPad), 1024px+ (desktop).

### 5. Progressive Disclosure

Reveal complexity on demand. Don't show everything at once:

- **Service grid** — Category overview cards first → click to drill into individual services. URL state (`?treatment=`, `?treatmentArea=`) keeps deep links shareable.
- **Expand/collapse** — Long descriptions show 3-4 lines with a "Read More" toggle. Threshold: > 140 characters for service cards, > 180 for team bios, > 100 for pricelist items.
- **Modal booking** — Iframe isn't loaded until the modal opens (`isOpen` guard). Spinner shown during load.
- **Cookie consent** — Banner shows on first visit; after choice, a small floating settings icon remains.
- **Mobile menu** — Fullscreen overlay only when toggled; body scroll is locked while open.

**Rules:**
- Any content longer than 4 lines on mobile must default to collapsed with an expand toggle.
- Heavy third-party embeds (maps, booking iframes) must lazy-load behind user interaction.
- State changes that affect visible content must update the URL so deep links and browser back/forward work correctly.

> These design principles are enforced by code review. When adding a new component, verify it against all five before opening a PR.
