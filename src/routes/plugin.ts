import type { RequestHandler } from "@builder.io/qwik-city";
import { setSpeakContext, validateLocale } from "qwik-speak";

import { resolveRequestLocale } from "~/shared/locale-navigation";
import { config } from "../speak-config";

/**
 * This middleware function must only contain the logic to set the locale,
 * because it is invoked on every request to the server.
 * Avoid redirecting or throwing errors here, and prefer layouts or pages
 */
export const onRequest: RequestHandler = ({ params, locale }) => {
	// Unknown pages (/nl-BE/old-link/) keep the locale of their first segment.
	const requestedLocale = resolveRequestLocale(params.lang);
	const lang = validateLocale(requestedLocale)
		? requestedLocale
		: config.defaultLocale.lang;

	// Set Speak context (optional: set the configuration on the server)
	setSpeakContext(config);

	// Set Qwik locale
	locale(lang);
};
