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
