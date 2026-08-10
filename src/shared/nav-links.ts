import type { inlineTranslate } from "qwik-speak";

export function getNavLinks(
	t: ReturnType<typeof inlineTranslate>,
	includeHome = true,
) {
	const links = [
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

	return links.map(({ href, key }) => ({ label: t(key), href }));
}
