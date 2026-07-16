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
  // 1. Create and validate the per-request client
  const client = supabase(requestEv);
  if (!client) return [];

  // 2. Query only the columns required for localization and rendering
  const { data, error } = await client
    .schema("gettimely")
    .from("table_name")
    .select("id,name,name_ru,name_nl,name_fr,name_uk,priority")
    .eq("active", true)
    .order("priority", { ascending: true });

  // 3. Handle errors gracefully
  if (error) {
    logServerEvent("ERROR", "supabase_fetch_failed", {
      resource: "table_name",
      error,
    });
    return []; // or null for single-record loaders
  }

  // 4. Validate, localize, and project compact serializable view models
  return projectServiceGroups(data, requestEv.locale());
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

**Rule:** Locale selection happens in the loader boundary through the pure helpers in `src/shared/locale-content.ts` and `src/shared/supabase-data.ts`. Components receive compact, already-localized view models and never inspect locale suffixes.

## Error Handling

Every loader must follow these rules:

1. **Catch Supabase errors** — check the `error` field from the query response.
2. **Log errors** — use `logServerEvent` with a stable event name and resource field.
3. **Return safe defaults** — `[]` for list loaders, `null` for single-record loaders.
4. **Never throw** — a thrown error inside `routeLoader$` breaks the entire page render.
5. **Handle missing data** — check `if (!data)` before mapping.

```tsx
// ✅ Correct
if (error) {
  logServerEvent("ERROR", "supabase_fetch_failed", {
    resource: "services",
    error,
  });
  return [];
}

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

`src/types.ts` defines the compact view models that are safe to serialize to components. Raw Supabase rows are untrusted and remain private to the projection boundary:

```tsx
export interface Staff {
  id: number;
  name: string;
  photo_url: string;
  about: string;
  role: string;
}

export interface Contact {
  email: string;
  open_hours: { start_week_day: string; end_week_day: string; from: string; to: string };
  location: { name: string; address: string; link: string };
  parking: { name: string; link: string }[];
}

export interface ServiceGroup {
  id: string;
  name: string;
  name_en: string;
  priority: number;
}

export interface Service {
  id: string;
  group_id: ServiceGroup["id"];
  name: string;
  description: string;
  duration: number;
  price: number;
}
```

**Rule:** Never cast raw Supabase results to these interfaces. Select explicit columns, validate/project with `src/shared/supabase-data.ts`, and return only fields consumed by the UI. When a table changes, update the projection tests, explicit select, and view model only when the UI contract actually changes.

## Adding a New Loader

1. Define or update the compact interface in `src/types.ts`.
2. Add the `routeLoader$` in `src/routes/[...lang]/layout.tsx`.
3. Export the loader so child routes can import it.
4. Follow the established pattern: create validated client → query explicit columns → handle/log error → runtime-validate → localize/project → return compact data.
5. Consume it in the route page file and pass data to components via props.
6. Never put `routeLoader$` inside a component file — they belong in route or layout files only.

## Environment Variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Environment-specific Supabase publishable/anon key; privileged keys are prohibited | Yes |

These are accessed at runtime via `event.env.get()` inside `routeLoader$` handlers. They are not baked into the client bundle.
Staging and production share one read-only Supabase project but use separate Secret Manager secrets and independently pinned versions. Runtime readiness rejects legacy `service_role` JWTs and `sb_secret_*` keys.

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
