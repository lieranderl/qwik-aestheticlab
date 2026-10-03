import { describe, expect, it } from "vitest";
import { shouldSmoothScroll } from "./smooth-scroll";

function fakeWindow(matches: Record<string, boolean>) {
	return {
		matchMedia: (query: string) => ({ matches: matches[query] ?? false }),
	} as unknown as Pick<Window, "matchMedia">;
}

describe("shouldSmoothScroll", () => {
	it("runs for mouse and trackpad users", () => {
		expect(
			shouldSmoothScroll(
				fakeWindow({ "(hover: hover) and (pointer: fine)": true }),
			),
		).toBe(true);
	});

	it("keeps native scrolling on touch devices", () => {
		expect(shouldSmoothScroll(fakeWindow({}))).toBe(false);
	});

	it("stays off with reduced motion", () => {
		expect(
			shouldSmoothScroll(
				fakeWindow({
					"(hover: hover) and (pointer: fine)": true,
					"(prefers-reduced-motion: reduce)": true,
				}),
			),
		).toBe(false);
	});
});
