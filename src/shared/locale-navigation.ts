import { config } from "~/speak-config";

/**
 * Generates a navigation link that preserves the current locale.
 * @param currentPathname - The current URL pathname (e.g. /fr-BE/services)
 * @param targetHash - The target hash or path (e.g. #services or services)
 * @returns The full path with specific locale prefix (e.g. /fr-BE/#services)
 */
export const getLocaleNavLink = (
	currentPathname: string,
	targetHash: string,
) => {
	// Check if current path starts with any supported locale
	const currentLocale = config.supportedLocales.find((l) =>
		currentPathname.startsWith(`/${l.lang}`),
	);

	const langPrefix = currentLocale ? `/${currentLocale.lang}` : "/en-BE";

	// Handle absolute paths (rare in this app's anchor nav) or relative
	// For anchors (#services), we prepend the lang prefix.
	if (targetHash.startsWith("/")) {
		return `${langPrefix}${targetHash}`;
	}

	return `${langPrefix}/${targetHash}`;
};

/** Each language in its own name, so "UK" can't be read as English. */
export const LOCALE_NATIVE_NAMES: Record<string, string> = {
	en: "English",
	nl: "Nederlands",
	fr: "Français",
	ru: "Русский",
	uk: "Українська",
};

export const getLocaleNativeName = (lang: string) =>
	LOCALE_NATIVE_NAMES[lang.split("-")[0]] ?? lang;

export interface LocaleSwitchLink {
	lang: string;
	label: string;
	/** Native language name, e.g. "Українська". */
	name: string;
	href: string;
	isCurrent: boolean;
}

/**
 * Links to the current page in every supported locale (e.g. /nl-BE/pricelist).
 */
export const getLocaleSwitchLinks = (
	currentPathname: string,
): LocaleSwitchLink[] => {
	const currentLang =
		config.supportedLocales.find((locale) =>
			currentPathname.startsWith(`/${locale.lang}`),
		)?.lang ?? config.defaultLocale.lang;
	const pathWithoutLocale =
		currentPathname.replace(/^\/[a-z]{2}-[A-Z]{2}(?=\/|$)/, "") || "/";

	return config.supportedLocales.map((locale) => ({
		lang: locale.lang,
		label: locale.lang.split("-")[0].toUpperCase(),
		name: getLocaleNativeName(locale.lang),
		href: `/${locale.lang}${pathWithoutLocale}`,
		isCurrent: locale.lang === currentLang,
	}));
};

/** True when the `[...lang]` route param is exactly a supported locale. */
export const isSupportedLocaleParam = (langParam: string | undefined) =>
	config.supportedLocales.some((locale) => locale.lang === langParam);

/**
 * Locale to render with: the first path segment when it is supported
 * (so /nl-BE/unknown/ shows a Dutch "not found" page), else the default.
 */
export const resolveRequestLocale = (langParam: string | undefined) => {
	const firstSegment = langParam?.split("/")[0];
	return config.supportedLocales.some((locale) => locale.lang === firstSegment)
		? (firstSegment as string)
		: config.defaultLocale.lang;
};
