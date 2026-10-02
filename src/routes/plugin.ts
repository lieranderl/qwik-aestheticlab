import type { RequestHandler } from "@builder.io/qwik-city";

import { config, isSupportedLocale } from "~/i18n-config";

/**
 * This middleware function must only contain the logic to set the locale,
 * because it is invoked on every request to the server.
 * Avoid redirecting or throwing errors here, and prefer layouts or pages
 */
export const onRequest: RequestHandler = ({ params, locale }) => {
	const requestedLocale = params.lang;
	const lang = isSupportedLocale(requestedLocale)
		? requestedLocale
		: config.defaultLocale.lang;

	// Set Qwik locale; compiled-i18n reads it via the getter in entry.ssr.tsx
	locale(lang);
};
