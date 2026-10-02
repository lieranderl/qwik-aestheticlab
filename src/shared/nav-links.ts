/**
 * Returns navigation link definitions with raw i18n keys.
 * Callers map each key to a literal compiled-i18n tagged template so the
 * translation is inlined at build time (dynamic keys are not inlined).
 */
export function getNavLinkKeys(includeHome = true) {
	const links: { href: string; key: string }[] = [
		{ href: "#services", key: "nav.services" },
		{ href: "#reviews", key: "nav.reviews" },
		{ href: "#gallery", key: "nav.work" },
		{ href: "#team", key: "nav.team" },
		{ href: "#faq", key: "faq.title" },
		{ href: "#contact", key: "nav.contact" },
	];

	if (includeHome) {
		links.unshift({ href: "#", key: "nav.home" });
	}

	return links;
}
