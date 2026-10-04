import { describe, expect, test } from "vitest";
import { getLegacyImageRequest } from "./legacy-image-request";

describe("getLegacyImageRequest", () => {
	test("resolves a cached legacy image to identical hashed content on the same origin", () => {
		const request = new Request(
			"https://aestheticlab.be/assets/B0kxtIDJ-lazer1.webp?x=1",
			{
				headers: { Accept: "image/webp" },
			},
		);
		const compatible = getLegacyImageRequest(request);
		expect(compatible?.url).toBe(
			"https://aestheticlab.be/assets/B0kxtIDJ-universal.webp?x=1",
		);
		expect(compatible?.headers.get("Accept")).toBe("image/webp");
		expect(request.url).toBe(
			"https://aestheticlab.be/assets/B0kxtIDJ-lazer1.webp?x=1",
		);
	});

	test("preserves HEAD requests", () => {
		const compatible = getLegacyImageRequest(
			new Request("https://aestheticlab.be/assets/BDz2OnHd-lazer1.webp", {
				method: "HEAD",
			}),
		);
		expect(compatible?.method).toBe("HEAD");
		expect(compatible?.url).toBe(
			"https://aestheticlab.be/assets/BDz2OnHd-universal.webp",
		);
	});

	test.each([
		"/assets/B0kxtIDJ-universal.webp",
		"/assets/B0kxtIDJ-other.webp",
		"/assets/lazer1.webp",
		"/build/B0kxtIDJ-lazer1.webp",
		"/assets/B0kxtIDJ-lazer1.webp/",
		"/en-BE/",
	])("does not alias unrelated or malformed paths: %s", (path) => {
		expect(
			getLegacyImageRequest(new Request(`https://aestheticlab.be${path}`)),
		).toBeNull();
	});

	test("does not rewrite mutations", () => {
		expect(
			getLegacyImageRequest(
				new Request("https://aestheticlab.be/assets/B0kxtIDJ-lazer1.webp", {
					method: "POST",
				}),
			),
		).toBeNull();
	});
});
