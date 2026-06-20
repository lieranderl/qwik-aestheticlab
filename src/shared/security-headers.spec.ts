import { describe, expect, it } from "vitest";
import { applySecurityHeaders, SECURITY_HEADERS } from "./security-headers";

describe("applySecurityHeaders", () => {
	it("adds the hardened response headers without replacing existing headers", () => {
		const response = new Response("OK", {
			headers: { "Cache-Control": "no-store" },
		});

		applySecurityHeaders(response);

		expect(response.headers.get("Cache-Control")).toBe("no-store");
		for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
			expect(response.headers.get(name)).toBe(value);
		}
	});
});
