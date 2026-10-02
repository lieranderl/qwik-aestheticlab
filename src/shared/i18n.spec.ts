import { withLocale } from "@qwik.dev/core";
import type { DocumentHeadProps } from "@qwik.dev/router";
import { describe, expect, it } from "vitest";
import { getCurrentLocale, localizeHead } from "./i18n";

function headProps(lang?: string) {
	return { params: lang ? { lang } : {} } as unknown as DocumentHeadProps;
}

describe("getCurrentLocale", () => {
	it("falls back to the default locale outside a request", () => {
		expect(getCurrentLocale()).toBe("en-BE");
	});

	it("returns the locale set for the current render", () => {
		expect(withLocale("nl-BE", getCurrentLocale)).toBe("nl-BE");
	});
});

describe("localizeHead", () => {
	const head = localizeHead(() => ({ title: getCurrentLocale() }));

	it("resolves the head in the route locale", () => {
		expect(head(headProps("uk-BE")).title).toBe("uk-BE");
	});

	it("uses the default locale for unsupported or missing params", () => {
		expect(head(headProps("de-DE")).title).toBe("en-BE");
		expect(head(headProps()).title).toBe("en-BE");
	});
});
