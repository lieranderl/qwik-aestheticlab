# Google Analytics Consent Mode v2 Plan

## Context

Implement Google Analytics for the Qwik City marketing site using Google Consent Mode v2 advanced mode for EEA traffic. The site already has a custom cookie banner with an analytics-only choice.

## Requirements

- Bootstrap `gtag.js` in production with Consent Mode defaults before any measurement command.
- Default all Google consent parameters to denied for EEA-safe behavior:
	- `analytics_storage`
	- `ad_storage`
	- `ad_user_data`
	- `ad_personalization`
- Grant only `analytics_storage` after the user accepts analytics. Keep advertising consent denied because the UI does not request advertising consent.
- Persist the user's choice and replay it on later page loads before GA configuration.
- Avoid `ga-disable-*` for rejected analytics because advanced consent mode still needs consent-aware cookieless pings.
- Track Qwik City client-side route changes without duplicating the initial page view.
- Track decision-grade business interactions after analytics consent:
	- booking modal opens
	- booking widget iframe loads
	- service/staff booking intent
	- service category views
	- pricelist views and price-list CTA clicks
	- directions, parking, email, Google reviews, and Instagram outbound clicks
	- language changes
	- cookie consent updates
- Update banner and privacy text so users are told analytics cookies are off until consent, while Google Consent Mode may send cookieless consent/measurement pings.

## Implementation Steps

1. Replace the current script-injection helper in `src/shared/cookie-consent.ts` with Consent Mode v2 helpers and a bootstrap script builder.
2. Mount the production Google tag bootstrap and route-change tracker from `src/root.tsx`.
3. Add a small Qwik `GoogleAnalytics` route tracking component.
4. Update cookie banner and privacy copy in source and locale JSON files.
5. Add a typed GA event helper so UI components do not call `gtag` directly.
6. Instrument high-intent marketing and booking interactions with non-PII event parameters.
7. Run Biome, type checking, and production build.

## Verification

- `bun run biome`
- `bun run build.types`
- `bun run build`
