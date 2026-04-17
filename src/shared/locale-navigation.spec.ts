import { expect, test } from "vitest";
import { getLocaleNavLink } from "./locale-navigation";

test("getLocaleNavLink correctly routes based on existing locale", () => {
	expect(getLocaleNavLink("/en-BE/services", "#services")).toBe(
		"/en-BE/#services",
	);
	expect(getLocaleNavLink("/fr-BE", "/about")).toBe("/fr-BE/about");
	expect(getLocaleNavLink("/unknown", "#contact")).toBe("/en-BE/#contact");
});
