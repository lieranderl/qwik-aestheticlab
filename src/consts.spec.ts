import { describe, expect, it } from "vitest";
import { formatPrice } from "./consts";

describe("formatPrice", () => {
	it("uses the requested storefront locale", () => {
		const english = formatPrice(50, "en-BE");
		const french = formatPrice(50, "fr-BE");

		expect(english).toContain("50");
		expect(french).toContain("50");
		expect(english).not.toBe(french);
	});
});
