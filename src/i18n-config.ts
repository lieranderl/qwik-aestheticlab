/**
 * Locale configuration shared by the app, routing, and `vite.config.ts`.
 * Keep this file framework-free: the Vite config imports it at build time.
 */
export interface LocaleConfig {
	lang: string;
	currency: string;
	timeZone: string;
}

const brussels = { currency: "EUR", timeZone: "Europe/Brussels" } as const;

export const config = {
	defaultLocale: { lang: "en-BE", ...brussels } as LocaleConfig,
	supportedLocales: [
		{ lang: "en-BE", ...brussels },
		{ lang: "ru-BE", ...brussels },
		{ lang: "nl-BE", ...brussels },
		{ lang: "fr-BE", ...brussels },
		{ lang: "uk-BE", ...brussels },
	] as LocaleConfig[],
};

/** Locale codes in configuration order; also the per-locale client build folders. */
export const localeCodes = config.supportedLocales.map((locale) => locale.lang);

export const isSupportedLocale = (lang: string | undefined): lang is string =>
	!!lang && localeCodes.includes(lang);
