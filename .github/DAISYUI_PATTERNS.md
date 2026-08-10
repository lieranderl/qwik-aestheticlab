# DaisyUI Patterns — Project Reference

This file documents how DaisyUI 5 components are used in this project. AI agents and developers should follow these established patterns for consistency.

> **Source of truth:** <https://daisyui.com/components/>
> **DaisyUI version:** 5.x (configured via `@plugin "daisyui"` in `src/global.css`)

## Theme Configuration

The custom theme is defined in `src/global.css` inside the `@plugin "daisyui/theme"` block:

```css
@plugin "daisyui/theme" {
  name: "Aesthetic";
  default: true;
  prefersdark: true;
  color-scheme: "light";
  /* ... color tokens ... */
}
```

### Key Palette Tokens

| Token | Hex | Usage |
| ------- | ----- | ------- |
| `base-100` | `#fffaf3` | Warm ivory cards and navigation surfaces |
| `base-200` | `#f1f0e9` | Warm stone supporting surfaces |
| `base-300` | `#d9dcd4` | Soft sage-grey borders and dividers |
| `base-content` | `#39443a` | Soft botanical ink text |
| `primary` | `#a8b1a2` | Warm sage backgrounds and brand identity |
| `primary-content` | `#2f382f` | Deep olive text on warm sage |
| `secondary` | `#5a4640` | Warm walnut headings and restrained accents |
| `accent` | `#9a6173` | Dusty berry highlights |
| `neutral` | `#2f382f` | Deep olive primary actions |

**Rule:** Always use these tokens via DaisyUI classes (`bg-primary`, `text-base-content`, etc.) rather than hardcoding hex values.

## Buttons (`btn`)

### Standard Patterns Used

```tsx
// Primary CTA
<button class="btn btn-primary">Book Now</button>

// Primary outline (used for secondary actions, nav CTAs when not scrolled)
<button class="btn btn-primary btn-outline">View Services</button>

// Small outline (used inside cards, inline actions)
<button class="btn btn-sm btn-outline">Book Now</button>

// Ghost button (close buttons, minimal UI)
<button class="btn btn-sm btn-square btn-ghost">✕</button>

// Large CTA with custom tracking
<button class="btn btn-primary btn-lg font-montserrat font-medium tracking-widest uppercase">
  Book Appointment
</button>

// Rounded pill style (cookie banner, specific CTAs)
<button class="btn btn-primary btn-sm rounded-full">Accept</button>
<button class="btn btn-outline btn-sm rounded-full">Reject</button>
```

### Button Conventions

- **Primary actions** → `btn btn-primary`
- **Secondary actions** → `btn btn-primary btn-outline` or `btn btn-outline btn-neutral`
- **Destructive/dismiss** → `btn btn-ghost` or `btn btn-outline`
- **Size** → default for main CTAs, `btn-sm` for inline/card actions, `btn-lg` for hero CTAs
- Always add `type="button"` on non-submit buttons.
- Add `font-montserrat uppercase tracking-wider` for branded button text.

## Modals (`modal`)

Used for the booking widget. Pattern:

```tsx
<dialog id={uniqueId} class="modal">
  <div class="modal-box w-full max-w-5xl p-2 pt-10 bg-base-200 rounded-2xl">
    <form method="dialog">
      <button type="submit" class="btn btn-sm btn-square btn-ghost absolute right-1 top-1">
        ✕
      </button>
    </form>
    {/* Modal content */}
  </div>
</dialog>
```

### Modal Conventions

- Open via `(document.getElementById(id) as HTMLDialogElement).showModal()`.
- Close via `<form method="dialog">` button or the `close` event.
- Use `isOpen` signal to conditionally render heavy content (e.g., iframes) — avoid loading until modal is opened.
- Modal IDs must be unique per instance (e.g., `modal_service_${serviceId}`, `modal_tech_${techId}`).

## Cards

### Service Cards

Service cards use a custom image overlay pattern rather than the standard DaisyUI `card` class, but still follow DaisyUI token conventions:

```tsx
<div class="group relative h-[400px] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-sm transition-shadow duration-200 hover:shadow-xl">
  {/* Background image + gradient overlay */}
  {/* Content positioned absolute at bottom */}
</div>
```

### Info Cards (Contact, Team)

These use the DaisyUI `card` component:

```tsx
<div class="card surface-card overflow-hidden lg:card-side">
  <div class="card-body p-8 md:p-12">
    {/* Content */}
  </div>
  <figure class="lg:w-7/12">
    {/* Image/Map */}
  </figure>
</div>
```

### Team Member Cards

```tsx
<div class="surface-card flex h-full flex-col p-8 text-center transition-shadow duration-200 hover:shadow-md">
  {/* Avatar, name, bio, booking button */}
</div>
```

### Card Conventions

- Cards use `rounded-2xl` consistently (matches the `--radius-box: 1rem` theme token).
- Controls and badges use pill radius via DaisyUI selector/field tokens plus `rounded-full` where explicit styling is needed.
- Use opaque or near-opaque surfaces instead of large backdrop-filter areas.
- Hover feedback uses the shared 150–200 ms motion scale and compositor-safe transforms only.

## Dropdowns (`dropdown`)

Used for the language switcher:

```tsx
<div class="dropdown dropdown-end">
  <button type="button" tabIndex={0} class="...">
    {currentLang}
  </button>
  <ul tabIndex={-1} class="dropdown-content menu bg-base-200 rounded-2xl z-10 w-32 p-2 shadow-lg border-base-content border">
    <li><a class="text-sm">EN</a></li>
  </ul>
</div>
```

### Dropdown Conventions

- Use `dropdown-end` for right-aligned dropdowns.
- Menu items inside `<ul class="dropdown-content menu">`.
- Active item gets `font-bold text-primary`.

## Rating (`rating`)

Used in the reviews section:

```tsx
<div class="rating rating-sm gap-0.5" role="img" aria-label="5 out of 5 stars">
  {[1, 2, 3, 4, 5].map((i) => (
    <div
      key={i}
      class="mask mask-star-2 bg-warning"
      aria-hidden="true"
      aria-current={i === 5 ? "true" : undefined}
    />
  ))}
</div>
```

### Rating Conventions

- Display-only ratings use non-interactive elements and mark the selected value with `aria-current="true"`.
- The selected value makes it and every preceding star fully opaque; without it daisyUI intentionally renders stars at 20% opacity.
- Expose the group as one localized `role="img"` label and hide the decorative star elements from assistive technology.
- Star color: `bg-warning` (golden).
- Interactive ratings use radio inputs with a unique `name`; do not use inputs for display-only ratings.

## Links (`link`)

```tsx
<a class="link link-primary" href={href}>Privacy Policy</a>
```

## Dividers (`divider`)

```tsx
<div class="divider my-0 opacity-50"></div>
```

Also used as thin decorative lines:

```tsx
<div class="h-px w-20 bg-primary mx-auto" />
```

## Text Rotate (`text-rotate`)

Used for the hero service line. Keep the official nested structure and reserve a
stable width so words do not shift the surrounding sentence:

```tsx
<span class="text-rotate w-64 font-qestero leading-[1.5] duration-10000">
  <span class="justify-items-center">
    <span class="text-primary">manicure</span>
    <span class="text-secondary">pedicure</span>
    <span class="hero-rotate-accent">brows &amp; lashes</span>
    <span class="text-base-content">laser</span>
  </span>
</span>
```

The custom line height follows DaisyUI's tall-font pattern and prevents Qestero
glyphs from clipping. Provide the complete sentence separately for assistive
technology, pause the looping track off-screen, and disable it when reduced
motion is requested. Give each row a distinct semantic theme color; derive the
plum variant from `accent` and `base-content` to preserve contrast on
`base-200`.

## Carousel (`carousel`)

Used for the Instagram feed:

```tsx
<div class="carousel w-full gap-8 overflow-x-auto pb-4 cursor-grab">
  {items.map((item) => (
    <div key={item} class="carousel-item w-81.5 shrink-0">
      {/* Card content */}
    </div>
  ))}
</div>
```

## Cookie Banner

Uses DaisyUI button patterns within a fixed-position card:

```tsx
<div class="fixed inset-x-0 bottom-0 z-120 p-3 md:p-6">
  <div class="mx-auto max-w-4xl rounded-2xl border border-base-content/15 bg-base-100/96 p-4 shadow-xl backdrop-blur md:p-6">
    {/* Content + btn btn-outline btn-sm rounded-full / btn btn-primary btn-sm rounded-full */}
  </div>
</div>
```

## Z-Index Scale

| Layer | z-index | Usage |
| ------- | --------- | ------- |
| Navigation header | `z-100` | Fixed nav bar |
| Cookie settings | `z-110` | Persistent compact settings control |
| Mobile menu overlay | `z-120` | Full-screen mobile nav |
| Cookie banner | `z-130` | Consent decision panel |

## Combining DaisyUI with Tailwind

DaisyUI classes and Tailwind utilities coexist freely. The established pattern:

```tsx
<button class="btn btn-primary btn-lg font-montserrat font-medium tracking-widest uppercase transition-colors duration-150">
  {/* DaisyUI: btn btn-primary btn-lg */}
  {/* Tailwind: font-montserrat font-medium tracking-widest uppercase */}
  {/* Interaction feedback stays within the shared 150–200 ms motion scale. */}
</button>
```

**Rule:** DaisyUI handles the component structure and theme colors. Tailwind handles spacing, typography, layout, and micro-animations.

## When to Use Which

| Need | Use |
| ------ | ----- |
| Buttons | DaisyUI `btn` + variants |
| Modals/dialogs | DaisyUI `modal` with `<dialog>` |
| Dropdowns | DaisyUI `dropdown` + `menu` |
| Star ratings | DaisyUI `rating` + `mask-star-2` |
| Navigation links | DaisyUI `link` |
| Horizontal separator | DaisyUI `divider` |
| Horizontal scroll | DaisyUI `carousel` |
| Rotating hero copy | DaisyUI `text-rotate` |
| Cards | DaisyUI `card` for standard layouts; custom div for image-overlay cards |
| Badges/pills | DaisyUI `badge` |
| Loading states | DaisyUI `loading loading-spinner` |
| Alerts/notifications | DaisyUI `alert` |
| Tabs | DaisyUI `tabs` |
| Tooltips | DaisyUI `tooltip` |
| Form inputs | DaisyUI `input`, `select`, `textarea`, `checkbox`, `toggle` |
| Layout/spacing | Tailwind utilities |
| Typography | Tailwind + project font classes (`font-qestero`, `font-montserrat`) |
| Animations | `FadeUp` component + Tailwind transitions |
| Responsive design | Tailwind breakpoints (`md:`, `lg:`, `xl:`) |

## Adding New DaisyUI Components

When introducing a DaisyUI component not yet used in the project:

1. Check <https://daisyui.com/components/> for the latest v5 API.
2. Follow the existing pattern of combining DaisyUI structure classes with Tailwind for customization.
3. Use theme tokens for colors — do not override with arbitrary values.
4. Match the `rounded-2xl` border radius convention unless the component has its own radius token.
5. Document the new pattern in this file under a new heading.
