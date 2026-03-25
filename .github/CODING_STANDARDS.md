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
|------|-----|
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
|------|-----------|---------|
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

When tests are added to this project:

- Place test files adjacent to the module they test: `service-utils.test.ts` next to `service-utils.ts`.
- Use the test runner configured in `package.json` (currently none — when adding, prefer `vitest`).
- Test utilities and shared logic first; snapshot-test components only when layout stability matters.

## Git Commit Hygiene

- Run `bun run biome` before committing (enforced by husky).
- Write concise commit messages: `fix: resolve locale fallback for Dutch` or `feat: add pricelist page`.
- Do not commit `node_modules`, `dist`, `server`, or `tmp` directories.