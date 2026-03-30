# DaisyUI Patterns — Project Reference

This file documents how DaisyUI 5 components are used in this project. AI agents and developers should follow these established patterns for consistency.

> **Source of truth:** https://daisyui.com/components/
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
|-------|-----|-------|
| `base-100` | `#f0f2f0` | Card backgrounds, light surfaces |
| `base-200` | `#8b9687` | Page background, muted surfaces |
| `base-300` | `#6b7568` | Borders, dividers |
| `base-content` | `#0d1f12` | Primary text |
| `primary` | `#1f3828` | CTAs, headings, brand accent |
| `primary-content` | `#ffffff` | Text on primary backgrounds |
| `secondary` | `#3e2b22` | Warm accents, subheadings |
| `accent` | `#8a4f68` | Highlight accents |
| `neutral` | `#5c635a` | Subtle UI elements |

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

### Convention

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

### Convention

- Open via `(document.getElementById(id) as HTMLDialogElement).showModal()`.
- Close via `<form method="dialog">` button or the `close` event.
- Use `isOpen` signal to conditionally render heavy content (e.g., iframes) — avoid loading until modal is opened.
- Modal IDs must be unique per instance (e.g., `modal_service_${serviceId}`, `modal_tech_${techId}`).

## Cards

### Service Cards

Service cards use a custom image overlay pattern rather than the standard DaisyUI `card` class, but still follow DaisyUI token conventions:

```tsx
<div class="group relative h-[400px] w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl cursor-pointer bg-neutral-900">
  {/* Background image + gradient overlay */}
  {/* Content positioned absolute at bottom */}
</div>
```

### Info Cards (Contact, Team)

These use the DaisyUI `card` component:

```tsx
<div class="card lg:card-side bg-base-100/90 backdrop-blur-md overflow-hidden border border-white/50 shadow-xl rounded-2xl">
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
<div class="bg-base-100/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-102 text-center border border-white/50 h-full flex flex-col">
  {/* Avatar, name, bio, booking button */}
</div>
```

### Convention

- Cards use `rounded-2xl` consistently (matches `--radius-box: 2rem` theme token).
- Controls and badges use pill radius via DaisyUI selector/field tokens plus `rounded-full` where explicit styling is needed.
- Glass/frosted effect: `bg-base-100/90 backdrop-blur-sm border border-white/50`.
- Hover: `hover:shadow-xl` + optional `hover:scale-102` or `hover:scale-105`.

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

### Convention

- Use `dropdown-end` for right-aligned dropdowns.
- Menu items inside `<ul class="dropdown-content menu">`.
- Active item gets `font-bold text-primary`.

## Rating (`rating`)

Used in the reviews section:

```tsx
<div class="rating rating-sm gap-0.5">
  {[1, 2, 3, 4, 5].map((i) => (
    <input
      key={i}
      type="radio"
      name={`rating-${uniqueIndex}`}
      class="mask mask-star-2 bg-warning"
      checked
      disabled
    />
  ))}
</div>
```

### Convention

- Display-only ratings use `checked disabled` on all inputs.
- Star color: `bg-warning` (golden).
- Each rating group needs a unique `name` to avoid radio button conflicts.

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
|-------|---------|-------|
| Body grain overlay | `z-[9999]` | Noise texture pseudo-element |
| Navigation header | `z-100` | Fixed nav bar |
| Mobile menu overlay | `z-110` | Full-screen mobile nav |
| Cookie banner | `z-120` | Bottom cookie consent |

## Combining DaisyUI with Tailwind

DaisyUI classes and Tailwind utilities coexist freely. The established pattern:

```tsx
<button class="btn btn-primary btn-lg font-montserrat font-medium tracking-widest uppercase hover:-translate-y-1 transition-all duration-300">
  {/* DaisyUI: btn btn-primary btn-lg */}
  {/* Tailwind: font-montserrat font-medium tracking-widest uppercase */}
  {/* Tailwind animation: hover:-translate-y-1 transition-all duration-300 */}
</button>
```

**Rule:** DaisyUI handles the component structure and theme colors. Tailwind handles spacing, typography, layout, and micro-animations.

## When to Use Which

| Need | Use |
|------|-----|
| Buttons | DaisyUI `btn` + variants |
| Modals/dialogs | DaisyUI `modal` with `<dialog>` |
| Dropdowns | DaisyUI `dropdown` + `menu` |
| Star ratings | DaisyUI `rating` + `mask-star-2` |
| Navigation links | DaisyUI `link` |
| Horizontal separator | DaisyUI `divider` |
| Horizontal scroll | DaisyUI `carousel` |
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

1. Check https://daisyui.com/components/ for the latest v5 API.
2. Follow the existing pattern of combining DaisyUI structure classes with Tailwind for customization.
3. Use theme tokens for colors — do not override with arbitrary values.
4. Match the `rounded-2xl` border radius convention unless the component has its own radius token.
5. Document the new pattern in this file under a new heading.
