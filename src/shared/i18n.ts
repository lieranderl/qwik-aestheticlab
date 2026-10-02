import { getLocale } from "@builder.io/qwik";
import { config } from "~/i18n-config";

/**
 * Current request/document locale (e.g. `nl-BE`).
 *
 * During SSR this is the locale set by `src/routes/plugin.ts`; in the browser
 * Qwik reads it from the container's `q:locale` attribute.
 */
export const getCurrentLocale = (): string =>
	getLocale(config.defaultLocale.lang);
