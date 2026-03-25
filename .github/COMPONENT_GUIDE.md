# Component Guide — Building & Extending UI

This guide documents the component architecture, patterns, and step-by-step instructions for creating new components in this project.

## Component Taxonomy

| Category | Directory | Purpose | Examples |
|----------|-----------|---------|----------|
| **Sections** | `src/components/sections/` | Full-width page blocks anchored by `id` | `hero-section`, `service-grid`, `team-section` |
| **UI** | `src/components/ui/` | Reusable primitives composed inside sections or pages | `fade-up`, `booking-modal`, `service-card` |
| **Router Head** | `src/components/router-head/` | Document `<head>` management | `router-head` |

### Sections vs UI — Decision Criteria

Choose **section** when:
- The component represents a full page block (hero, services, team, gallery, contact, footer).
- It has an anchor `id` for in-page navigation.
- It is composed directly inside a route page file (`index.tsx`).

Choose **UI** when:
- The component is reused across multiple sections or pages.
- It encapsulates a single interactive pattern (modal, card, animation wrapper, form input).
- It receives all data via props — no awareness of page context.

## Existing Components Reference

### Sections

| Component | File | Anchor `id` | Data Source |
|-----------|------|-------------|-------------|
| `Navigation` | `navigation.tsx` | — (fixed header) | `inlineTranslate`, `useLocation` |
| `HeroSection` | `hero-section.tsx` | — (top of page) | Translations only |
| `ServiceGrid` | `service-grid.tsx` | `#services` | `services`, `serviceCategories`, `location` props |
| `TeamSection` | `team-section.tsx` | `#team` | `technicians` prop |
| `ReviewsSection` | `reviews-section.tsx` | — (no anchor) | Hardcoded review data |
| `GalleryGrid` | `gallery-grid.tsx` | `#gallery` | Static image imports + hardcoded Instagram IDs |
| `AboutSection` | `about-section.tsx` | `#about` | Translations only |
| `ContactSection` | `contact-section.tsx` | `#contact` | `contact` prop |
| `Footer` | `footer.tsx` | — (page bottom) | Translations, `useLocation` |

### UI

| Component | File | Purpose |
|-----------|------|---------|
| `FadeUp` | `fade-up.tsx` | Scroll-triggered entrance animation (IntersectionObserver) |
| `Booking` | `booking-modal.tsx` | DaisyUI modal wrapping a GetTimely booking iframe |
| `ServiceCard` | `service-card.tsx` | Image-overlay card for service display |
| `LanguageSwitcher` | `language-switcher.tsx` | DaisyUI dropdown for locale switching |
| `CookieBanner` | `cookie-banner.tsx` | GDPR cookie consent banner |
| `InstagramCard` | `instagram-card.tsx` | Instagram embed blockquote |
| `MapEmbed` | `google-map.tsx` | Google Maps iframe embed |
| `RotatingText` | `rotating-text.tsx` | CSS text rotation animation for hero keywords |

## Creating a New Section Component

### 1. Create the File

```
src/components/sections/my-section.tsx
```

File naming: `kebab-case.tsx`.

### 2. Follow the Standard Structure

```tsx
import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";

interface MySectionProps {
  // Props typed from data passed by the route page
  items: MyItem[];
}

export const MySection = component$<MySectionProps>(({ items }) => {
  const t = inlineTranslate();

  return (
    <section id="my-section" class="py-24 bg-base-200">
      <div class="custom-container">
        {/* Section Header */}
        <div class="mb-16 text-center">
          <FadeUp>
            <h2 class="font-qestero mb-4 text-4xl md:text-5xl text-base-content">
              {t("app.my_section.title@@Section Title")}
            </h2>
            <div class="h-px w-20 bg-primary mx-auto" />
            <p class="font-montserrat mt-6 max-w-lg mx-auto text-base-content">
              {t("app.my_section.subtitle@@Section subtitle text.")}
            </p>
          </FadeUp>
        </div>

        {/* Section Content */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <FadeUp key={item.id} delay={index * 100}>
              {/* Item rendering */}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
});
```

### 3. Key Patterns to Follow

- **Named export** — `export const MySection`, not `export default`.
- **Section wrapper** — `<section id="my-section" class="py-24 bg-base-200">`.
- **Container** — `<div class="custom-container">` for consistent max-width and padding.
- **Section header** — `font-qestero` heading + `h-px w-20 bg-primary mx-auto` divider line + `font-montserrat` subtitle.
- **Staggered animation** — `FadeUp` with incremental `delay={index * 100}` or `delay={index * 150}`.
- **Translations** — All user-facing strings wrapped with `t("app.section.key@@Default")`.
- **Background alternation** — Sections alternate between `bg-base-200` (muted) and no background class (inherits page bg). Check adjacent sections in `index.tsx` to pick the right one.

### 4. Compose in the Route Page

```tsx
// src/routes/[...lang]/index.tsx
import { MySection } from "~/components/sections/my-section";

export default component$(() => {
  const myData = useMyDataLoader();

  return (
    <div class="min-h-screen">
      <Navigation />
      <main>
        {/* ... other sections ... */}
        <MySection items={myData.value} />
        {/* ... other sections ... */}
      </main>
      <Footer />
    </div>
  );
});
```

### 5. Add Navigation Anchor (if needed)

If the section should appear in the main navigation, add it to `src/constants/navigation.ts`:

```tsx
export const getNavLinks = (t: TranslateFn) => [
  // ... existing links ...
  { label: t("app.nav.my_section@@My Section"), href: "#my-section" },
];
```

And update the inline `navLinks` array in `src/components/sections/navigation.tsx` to include the new entry.

## Creating a New UI Component

### 1. Create the File

```
src/components/ui/my-widget.tsx
```

### 2. Follow the Standard Structure

```tsx
import { component$ } from "@builder.io/qwik";

interface MyWidgetProps {
  label: string;
  variant?: "default" | "compact";
  class?: string;
}

export const MyWidget = component$<MyWidgetProps>(
  ({ label, variant = "default", class: className = "" }) => {
    return (
      <div class={`${variant === "compact" ? "p-2" : "p-4"} ${className}`}>
        <span class="font-montserrat text-sm text-base-content">{label}</span>
      </div>
    );
  },
);
```

### 3. Key Patterns to Follow

- **Named export** — always.
- **Typed props** — define an interface above the component.
- **Optional `class` prop** — allow parent components to extend styling. Use `class: className` destructuring to avoid the reserved word.
- **DaisyUI first** — use DaisyUI component classes before custom CSS.
- **No data fetching** — UI components receive everything via props.
- **No route awareness** — UI components should not import `useLocation` or `routeLoader$` unless they genuinely need URL context (like `LanguageSwitcher`).

## The FadeUp Component

`FadeUp` is the standard animation wrapper used throughout the project. Understand it before building new animated components.

### Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `delay` | `number` | `0` | Milliseconds before animation starts after element enters viewport |
| `duration` | `number` | `800` | Animation duration in ms |
| `threshold` | `number` | `0.1` | IntersectionObserver threshold (0–1) |
| `runOnce` | `boolean` | `true` | Animate only on first intersection |
| `rootMargin` | `number` | `50` | Viewport margin for triggering |
| `easing` | `string` | `"ease-out"` | CSS timing function |
| `distance` | `number` | `60` | Travel distance in pixels |
| `direction` | `"up" \| "down" \| "left" \| "right"` | `"up"` | Direction element enters from |
| `disable` | `boolean` | `false` | Skip animation entirely |
| `class` | `string` | `""` | Additional CSS classes |

### Usage Patterns

```tsx
// Basic fade-up for section content
<FadeUp>
  <h2>Title</h2>
</FadeUp>

// Staggered grid items
{items.map((item, i) => (
  <FadeUp key={item.id} delay={i * 100}>
    <Card item={item} />
  </FadeUp>
))}

// Directional entrance for side content
<FadeUp delay={300} direction="left" distance={80}>
  <SideImage />
</FadeUp>

// Longer entrance for hero elements
<FadeUp delay={300} duration={1200} direction="up" distance={40}>
  <Logo />
</FadeUp>
```

## The Booking Component

`Booking` wraps a GetTimely booking iframe inside a DaisyUI modal. It is the standard CTA pattern.

### Props

| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| `id` | `string` | Yes | Unique dialog element ID |
| `text` | `string` | Yes | Button label |
| `classes` | `string` | No | Button CSS classes (defaults to `btn btn-primary`) |
| `location` | `string` | Yes | GetTimely location ID |
| `category` | `string` | No | Pre-select a service category |
| `product` | `string` | No | Pre-select a specific service |
| `staff` | `string` | No | Pre-select a staff member |

### Usage

```tsx
<Booking
  id="hero-book-btn"
  text={t("app.book.book_app@@Book Appointment")}
  location="372146"
  classes="btn btn-primary btn-lg"
/>

// Book with a specific staff member
<Booking
  id={`modal_tech_${tech.id}`}
  text={t("app.book.book_now@@Book Now")}
  location="372146"
  staff={String(tech.id)}
  classes="btn btn-outline btn-neutral rounded-full"
/>
```

**Key rule:** Every `Booking` instance needs a unique `id`. Use a pattern like `modal_service_${serviceId}` or `modal_tech_${techId}` to ensure uniqueness when rendering in loops.

## Image Handling

### Static Image Imports

Use Vite's `?jsx` query to import images as Qwik components:

```tsx
import ImgPhoto from "~/media/gallery/photo.jpg?jsx";

// Renders as an optimized <img> element
<ImgPhoto class="w-full h-full object-cover" alt="Description" />
```

### Dynamic Images

For images from Supabase or runtime URLs, use standard `<img>`:

```tsx
<img
  src={dynamicUrl}
  alt="Description"
  class="w-full h-full object-cover"
  width={400}
  height={500}
  loading="lazy"
/>
```

Always provide:
- `alt` text (meaningful, not decorative placeholder).
- `width` and `height` attributes or aspect-ratio classes to prevent layout shift.
- `loading="lazy"` for below-fold images.

### Image Organization

```
src/media/
├── gallery/          # Photo gallery images (manicure1.jpg, pedicure2.jpg, etc.)
├── services/         # Service category cover images (*.png)
├── *.svg             # SVG logos and icons (Bird.svg, AestheticLab.svg)
└── *.jpg/png         # Staff photos and misc images
```

Service image resolution logic lives in `src/shared/service-utils.ts` — it maps category names to files via `import.meta.glob`.

## Component Composition in Pages

The route page (`routes/[...lang]/index.tsx`) is the single place where sections are composed. The established order:

```tsx
<Navigation />
<main>
  <HeroSection />
  <ServiceGrid services={...} serviceCategories={...} location={...} />
  <TeamSection technicians={...} />
  <ReviewsSection />
  <GalleryGrid />
  <AboutSection />
  <ContactSection contact={...} />
</main>
<Footer />
```

### Rules

- **Section order** is determined in the route page, not by the sections themselves.
- Sections do not import or render other sections.
- Data flows one way: route page → section props.
- Each section handles its own responsive layout and animation.

## Adding Interactive State

For local component state, use Qwik signals:

```tsx
import { component$, useSignal, $ } from "@builder.io/qwik";

export const Expandable = component$(() => {
  const isExpanded = useSignal(false);

  const toggle = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  return (
    <div>
      <button type="button" onClick$={toggle} class="btn btn-sm btn-ghost">
        {isExpanded.value ? "Collapse" : "Expand"}
      </button>
      <div class={isExpanded.value ? "block" : "hidden"}>
        {/* Expandable content */}
      </div>
    </div>
  );
});
```

### State Patterns Used in This Project

| Pattern | Example | Where |
|---------|---------|-------|
| Toggle boolean | `isExpanded`, `isMobileMenuOpen`, `showBanner` | Cards, Navigation, CookieBanner |
| Scroll state | `isScrolled` via `useOnWindow("scroll", ...)` | Navigation |
| Selected filter | `selectedCategoryId` | ServiceGrid |
| View mode toggle | `showFullList` | ServiceGrid |
| Modal open state | `isOpen` for conditional iframe rendering | Booking |

## Checklist for New Components

Before submitting a new component, verify:

- [ ] Uses `component$` (not a plain function or React component).
- [ ] Props are typed with an interface.
- [ ] All user-facing strings use `t("app.section.key@@Default")`.
- [ ] Uses DaisyUI component classes where applicable.
- [ ] Uses theme color tokens — no hardcoded hex values.
- [ ] Uses `font-qestero` for display text, `font-montserrat` for body text.
- [ ] Images have `alt` attributes.
- [ ] Interactive elements have `type="button"` (non-submit buttons).
- [ ] Decorative icons use `aria-hidden="true"`.
- [ ] Responsive design: works on mobile (375px+), tablet (768px+), desktop (1024px+).
- [ ] Animations use `FadeUp` or CSS transitions — respects `prefers-reduced-motion`.
- [ ] Event handlers use `$()` wrapper or `onClick$={$(() => ...)}` syntax.
- [ ] No `useEffect`, `useState`, `useRef`, or other React patterns.
- [ ] Biome passes: `bun run biome`.
- [ ] If new translation keys were added: `bun run qwik-speak-extract` was run.