import { describe, expect, it } from "vitest";
import { getNavLinkKeys } from "./nav-links";

describe("getNavLinkKeys", () => {
	it("returns all links including home by default", () => {
		const links = getNavLinkKeys();
		expect(links).toHaveLength(7); // home + 6 sections
		expect(links[0]).toEqual({ href: "#", key: "nav.home" });
	});

	it("excludes home when includeHome is false", () => {
		const links = getNavLinkKeys(false);
		expect(links).toHaveLength(6);
		expect(links[0]).toEqual({
			href: "#services",
			key: "nav.services",
		});
	});

	it("returns links with expected structure", () => {
		const links = getNavLinkKeys(true);
		for (const link of links) {
			expect(link).toHaveProperty("href");
			expect(link).toHaveProperty("key");
			expect(typeof link.href).toBe("string");
			expect(typeof link.key).toBe("string");
			expect(link.key).toMatch(/^[a-z_]+(\.[a-z_]+)+$/);
		}
	});
});
