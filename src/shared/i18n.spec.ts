import { withLocale } from "@builder.io/qwik";
import { describe, expect, it } from "vitest";
import { getCurrentLocale } from "./i18n";

describe("getCurrentLocale", () => {
	it("falls back to the default locale outside a request", () => {
		expect(getCurrentLocale()).toBe("en-BE");
	});

	it("returns the locale set for the current render", () => {
		expect(withLocale("nl-BE", getCurrentLocale)).toBe("nl-BE");
	});
});
