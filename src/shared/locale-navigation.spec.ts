import { describe, expect, test } from "vitest";
import {
	getLocaleNavLink,
	getLocaleSwitchLinks,
	isSupportedLocaleParam,
	resolveRequestLocale,
} from "./locale-navigation";

describe("getLocaleNavLink", () => {
	test("preserves the detected locale for anchor links", () => {
		expect(getLocaleNavLink("/en-BE/services", "#services")).toBe(
			"/en-BE/#services",
		);
		expect(getLocaleNavLink("/fr-BE/pricelist", "#contact")).toBe(
			"/fr-BE/#contact",
		);
		expect(getLocaleNavLink("/uk-BE", "#hero")).toBe("/uk-BE/#hero");
	});

	test("prefixes absolute targets with the current locale", () => {
		expect(getLocaleNavLink("/fr-BE", "/about")).toBe("/fr-BE/about");
		expect(getLocaleNavLink("/nl-BE/services/detail", "/pricelist")).toBe(
			"/nl-BE/pricelist",
		);
	});

	test("handles relative targets by nesting them under the locale", () => {
		expect(getLocaleNavLink("/ru-BE", "services")).toBe("/ru-BE/services");
		expect(getLocaleNavLink("/en-BE/pricelist", "contact")).toBe(
			"/en-BE/contact",
		);
	});

	test("falls back to the default locale when the path has no supported locale", () => {
		expect(getLocaleNavLink("/unknown", "#contact")).toBe("/en-BE/#contact");
		expect(getLocaleNavLink("/services", "/about")).toBe("/en-BE/about");
	});
});

describe("getLocaleSwitchLinks", () => {
	test("keeps the current page and marks the active locale", () => {
		const links = getLocaleSwitchLinks("/fr-BE/pricelist");
		expect(links.map((link) => link.href)).toContain("/nl-BE/pricelist");
		expect(links.find((link) => link.isCurrent)?.lang).toBe("fr-BE");
		expect(links.find((link) => link.lang === "uk-BE")?.label).toBe("UK");
	});

	test("links to each locale home from the landing page", () => {
		const links = getLocaleSwitchLinks("/en-BE/");
		expect(links.find((link) => link.lang === "ru-BE")?.href).toBe("/ru-BE/");
		expect(getLocaleSwitchLinks("/en-BE").at(0)?.href).toMatch(
			/^\/[a-z]{2}-[A-Z]{2}\/$/,
		);
	});
});

describe("locale route params", () => {
	test("accepts only an exact supported locale as a page", () => {
		expect(isSupportedLocaleParam("nl-BE")).toBe(true);
		expect(isSupportedLocaleParam("nl-BE/unknown")).toBe(false);
		expect(isSupportedLocaleParam("de-BE")).toBe(false);
		expect(isSupportedLocaleParam(undefined)).toBe(false);
	});

	test("renders unknown pages in the locale of their first segment", () => {
		expect(resolveRequestLocale("nl-BE/unknown-page")).toBe("nl-BE");
		expect(resolveRequestLocale("de-BE")).toBe("en-BE");
		expect(resolveRequestLocale(undefined)).toBe("en-BE");
	});
});
