# Data Loading — Supabase Patterns

This project loads all server-side data from Supabase via `routeLoader$` functions. This guide documents the exact patterns, conventions, and rules for data access.

## Architecture Overview

```text
Browser Request
  → Qwik City Route
    → layout.tsx (routeLoader$ functions)
      → supabase(event) creates per-request client
        → Queries gettimely schema
          → Returns typed, locale-mapped data
            → Components receive data via props
```

**Single source of truth:** All Supabase queries live in `src/routes/[...lang]/layout.tsx`. Components never query Supabase directly.

## Supabase Client

Defined in `src/shared/supabase-client.ts`:

```tsx
import type { RequestEventAction } from "@builder.io/qwik-city";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";

export const supabase = (event: RequestEventAction) => {
  return createServerClient(
    event.env.get("SUPABASE_URL") ?? "",
    event.env.get("SUPABASE_KEY") ?? "",
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
};
```

### Key Points

- Uses `@supabase/ssr` for server-side usage within Qwik City.
- Environment variables `SUPABASE_URL` and `SUPABASE_KEY` are required — accessed via `event.env.get()`, not `process.env`.
- Cookie methods are no-ops because this project uses Supabase as a read-only data source (no auth sessions).
- A new client is created per request — do not cache or share clients across requests.

## routeLoader$ Pattern

Every loader follows this structure:

```tsx
export const useMyDataLoader = routeLoader$<ReturnType>(async (requestEv) => {
  // 1. Log for debugging
  console.log("Fetching [resource] from Supabase…");

  // 2. Create client
  const client = supabase(requestEv);

  // 3. Query with schema prefix
  const { data, error } = await client
    .schema("gettimely")
    .from("table_name")
    .select("*")
    .eq("active", true)
    .order("priority", { ascending: true });

  // 4. Handle errors gracefully
  if (error) {
    console.error("Error fetching [resource]:", error);
    return []; // or null for single-record loaders
  }
  if (!data) return [];

  // 5. Map locale-specific fields
  const shortlocal = requestEv.locale().split("-")[0];
  return data.map((item) => ({
    ...item,
    name: resolveLocaleField(item, "name", shortlocal),
    description: resolveLocaleField(item, "description", shortlocal),
  })) as MyType[];
});
```

## Existing Loaders

| Loader | Table | Returns | Null-safe default |
| --- | --- | --- | --- |
| `useContactLoader` | `contacts` | `Contact \| null` | `null` |
| `useServiceGroupsLoader` | `service_groups` | `ServiceGroup[]` | `[]` |
| `useTechniciansLoader` | `staff` | `Staff[]` | `[]` |
| `useServicesLoader` | `services` | `Service[]` | `[]` |

## Schema

All queries target the `gettimely` schema:

```tsx
client.schema("gettimely").from("table_name")
```

Do not query the default `public` schema unless explicitly needed for a new feature.

## Locale Field Mapping

Supabase tables store multilingual content via suffixed columns:

| Base field | Russian | Dutch | French | Ukrainian |
| --- | --- | --- | --- | --- |
| `name` | `name_ru` | `name_nl` | `name_fr` | `name_uk` |
| `description` | `description_ru` | `description_nl` | `description_fr` | `description_uk` |
| `about` | `about_ru` | `about_nl` | `about_fr` | `about_uk` |

The unsuffixed column is always English.

### Mapping Pattern

```tsx
const shortlocal = requestEv.locale().split("-")[0]; // "en", "ru", "nl", "fr", "uk"

const localizedName =
  shortlocal === "ru" ? item.name_ru
  : shortlocal === "nl" ? item.name_nl
  : shortlocal === "fr" ? item.name_fr
  : shortlocal === "uk" ? item.name_uk
  : item.name; // English fallback
```

**Rule:** This mapping happens exclusively in `routeLoader$` functions. Components receive already-localized data and never inspect locale suffixes.

## Error Handling

Every loader must follow these rules:

1. **Catch Supabase errors** — check the `error` field from the query response.
2. **Log errors** — use `console.error` with a descriptive message identifying the resource.
3. **Return safe defaults** — `[]` for list loaders, `null` for single-record loaders.
4. **Never throw** — a thrown error inside `routeLoader$` breaks the entire page render.
5. **Handle missing data** — check `if (!data)` before mapping.

```tsx
// ✅ Correct
if (error) {
  console.error("Error fetching services:", error);
  return [];
}
if (!data) return [];

// ❌ Wrong — will crash the page
if (error) throw new Error("Failed to fetch services");
```

## Caching

HTTP caching is configured in the `onGet` handler in `layout.tsx`:

```tsx
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7, // 7 days
    maxAge: 60 * 5, // 5 minutes
  });
};
```

This means:

- Fresh data is served for 300 seconds.
- After that, stale data is served while revalidation happens in the background.
- The stale window is 7 days.

Do not add per-loader caching. The HTTP cache layer handles it globally.

## Consuming Loaders in Components

Loaders are consumed in route page files, then passed as props to section components:

```tsx
// routes/[...lang]/index.tsx
export default component$(() => {
  const services = useServicesLoader();
  const categories = useServiceGroupsLoader();
  const technicians = useTechniciansLoader();
  const contact = useContactLoader();

  return (
    <div>
      <ServiceGrid
        services={services.value}
        serviceCategories={categories.value}
        location={contact.value?.location.name || ""}
      />
      <TeamSection technicians={technicians.value} />
      <ContactSection contact={contact.value} />
    </div>
  );
});
```

### Rules

- Access loader data via `.value` property.
- Pass data down as props — components should not call `useMyLoader()` themselves (unless they are in the same route file scope).
- Handle nullable data in components: `contact.value?.location.name || ""`.
- Loaders from `layout.tsx` are available to all child routes (both `index.tsx` and `pricelist/index.tsx` use them).

## Data Types

All Supabase data contracts are defined in `src/types.ts`:

```tsx
export interface Staff {
  id: string;
  name: string;
  photo_url: string;
  email: string;
  active: boolean;
  about: string;
  about_ru: string;
  about_nl: string;
  about_fr: string;
  about_uk: string;
  role: string;
}

export interface Contact {
  id: number;
  created_at: string;
  email: string;
  open_hours: { start_week_day: string; end_week_day: string; from: string; to: string };
  location: { name: string; address: string; link: string };
  parking: { name: string; link: string }[];
}

export interface ServiceGroup {
  id: string;
  name: string;
  name_ru: string;
  name_nl: string;
  name_fr: string;
  name_uk: string;
  name_en: string;
  active: boolean;
  priority: number;
}

export interface Service {
  id: string;
  group_id: ServiceGroup["id"];
  category: ServiceGroup["name"];
  name: string;
  name_ru: string;
  name_nl: string;
  name_fr: string;
  name_uk: string;
  description: string;
  description_ru: string;
  description_nl: string;
  description_fr: string;
  description_uk: string;
  duration: number;
  price: number;
  priority: number;
  active: boolean;
}
```

**Rule:** When Supabase tables change, update `src/types.ts` first, then update the corresponding loader and any component props.

## Adding a New Loader

1. Define or update the interface in `src/types.ts`.
2. Add the `routeLoader$` in `src/routes/[...lang]/layout.tsx`.
3. Export the loader so child routes can import it.
4. Follow the established pattern: log → create client → query → handle error → map locale fields → return typed data.
5. Consume it in the route page file and pass data to components via props.
6. Never put `routeLoader$` inside a component file — they belong in route or layout files only.

## Environment Variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/service key | Yes |

These are accessed at runtime via `event.env.get()` inside `routeLoader$` handlers. They are not baked into the client bundle.

For local development, set them in your shell environment or a `.env` file (Vite loads `.env` files automatically).

## Common Mistakes

| Mistake | Correct Approach |
| --- | --- |
| Querying Supabase inside a component | Move the query to a `routeLoader$` in a route/layout file |
| Using `process.env.SUPABASE_URL` | Use `event.env.get("SUPABASE_URL")` |
| Throwing errors in loaders | Catch, log, and return safe defaults |
| Mapping locale fields in components | Map in the loader, pass localized data via props |
| Importing the Supabase client in browser code | `supabase()` is server-only — only call it inside `routeLoader$` or `server$` |
| Forgetting `schema("gettimely")` | All data tables live in the `gettimely` schema |
| Caching Supabase client across requests | Create a new client per request via `supabase(event)` |
