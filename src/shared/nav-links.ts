export interface NavLinkKey {
	href: string;
	key: string;
	/** Shown in the desktop header; every link is shown in the phone menu and footer. */
	primary: boolean;
	/** Landing-page section id used to highlight the current section. */
	sectionId?: string;
}

/**
 * Returns navigation link definitions with raw i18n keys.
 * Callers must apply their own translate function to produce labels.
 *
 * This avoids the qwik-speak inline plugin removing the `inlineTranslate()`
 * declaration when `t` is only passed as a reference (not called directly
 * in the same file).
 */
export function getNavLinkKeys(): NavLinkKey[] {
	return [
		{
			href: "#services",
			key: "app.nav.services@@Services",
			primary: true,
			sectionId: "services",
		},
		{ href: "pricelist", key: "app.nav.prices@@Prices", primary: true },
		{
			href: "#gallery",
			key: "app.nav.work@@Our Work",
			primary: true,
			sectionId: "gallery",
		},
		{
			href: "#team",
			key: "app.nav.team@@Team",
			primary: true,
			sectionId: "team",
		},
		{
			href: "#faq",
			key: "app.nav.faq@@Good to know",
			primary: false,
			sectionId: "faq",
		},
		{
			href: "#contact",
			key: "app.nav.visit@@Visit",
			primary: true,
			sectionId: "contact",
		},
	];
}
