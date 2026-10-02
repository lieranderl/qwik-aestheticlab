import type { SpeakConfig } from "qwik-speak";

export const config: SpeakConfig = {
	defaultLocale: {
		lang: "en-BE",
		currency: "EUR",
		timeZone: "Europe/Brussels",
	},
	supportedLocales: [
		{ lang: "en-BE", currency: "EUR", timeZone: "Europe/Brussels" },
		{ lang: "ru-BE", currency: "EUR", timeZone: "Europe/Brussels" },
		{ lang: "nl-BE", currency: "EUR", timeZone: "Europe/Brussels" },
		{ lang: "fr-BE", currency: "EUR", timeZone: "Europe/Brussels" },
		{ lang: "uk-BE", currency: "EUR", timeZone: "Europe/Brussels" },
	],
	// Translations available in the whole app
	assets: ["app"],
	// Translations with dynamic keys available in the whole app
	runtimeAssets: ["runtime"],
};
