import type { RequestHandler } from "@builder.io/qwik-city";
import { setSpeakContext, validateLocale } from "qwik-speak";

import { config } from "../speak-config";

/**
 * This middleware function must only contain the logic to set the locale,
 * because it is invoked on every request to the server.
 * Avoid redirecting or throwing errors here, and prefer layouts or pages
 */
export const onRequest: RequestHandler = ({ params, locale }) => {
	const requestedLocale = params.lang;
	const lang =
		requestedLocale &&
		validateLocale(requestedLocale) &&
		config.supportedLocales.some((locale) => locale.lang === requestedLocale)
			? requestedLocale
			: config.defaultLocale.lang;

	// Set Speak context (optional: set the configuration on the server)
	setSpeakContext(config);

	// Set Qwik locale
	locale(lang);
};
