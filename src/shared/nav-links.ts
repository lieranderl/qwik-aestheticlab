/**
 * Returns navigation link definitions with raw i18n keys.
 * Callers must apply their own translate function to produce labels.
 *
 * This avoids the qwik-speak inline plugin removing the `inlineTranslate()`
 * declaration when `t` is only passed as a reference (not called directly
 * in the same file).
 */
export function getNavLinkKeys(includeHome = true) {
	const links: { href: string; key: string }[] = [
		{ href: "#services", key: "app.nav.services@@Services" },
		{ href: "#reviews", key: "app.nav.reviews@@Reviews" },
		{ href: "#gallery", key: "app.work.title@@Our Work" },
		{ href: "#team", key: "app.nav.team@@Team" },
		{ href: "#faq", key: "app.faq.title@@FAQ" },
		{ href: "#contact", key: "app.nav.contact@@Contact" },
	];

	if (includeHome) {
		links.unshift({ href: "#", key: "app.nav.home@@Home" });
	}

	return links;
}
