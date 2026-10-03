import { describe, expect, it } from "vitest";
import { getNavLinkKeys } from "./nav-links";

describe("getNavLinkKeys", () => {
	it("lists the landing sections and the price list in page order", () => {
		expect(getNavLinkKeys().map((link) => link.href)).toEqual([
			"#services",
			"pricelist",
			"#gallery",
			"#team",
			"#faq",
			"#contact",
		]);
	});

	it("keeps the desktop header to five primary links", () => {
		expect(getNavLinkKeys().filter((link) => link.primary)).toHaveLength(5);
	});

	it("returns links with translation keys and section ids for anchors", () => {
		for (const link of getNavLinkKeys()) {
			expect(link.key).toContain("@@");
			if (link.href.startsWith("#")) {
				expect(link.sectionId).toBe(link.href.slice(1));
			} else {
				expect(link.sectionId).toBeUndefined();
			}
		}
	});
});
