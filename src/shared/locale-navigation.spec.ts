import { describe, expect, test } from "vitest";
import { getLocaleNavLink } from "./locale-navigation";

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
