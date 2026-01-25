export type TranslateFn = (
	key: string,
	params?: Record<string, unknown>,
	lang?: string,
) => string;

export const getNavLinks = (t: TranslateFn) => [
	{ label: t("app.nav.home@@Home"), href: "#" },
	{ label: t("app.nav.services@@Services"), href: "#services" },
	{ label: t("app.nav.about@@About"), href: "#about" },
	{ label: t("app.nav.team@@Team"), href: "#team" },
	{ label: t("app.work.title@@Gallery"), href: "#gallery" },
	{ label: t("app.nav.contact@@Contact"), href: "#contact" },
];
