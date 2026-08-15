import { describe, expect, it } from "vitest";
import { bookingLocationId } from "~/consts";
import { resolveBookingLocation } from "./booking";

describe("resolveBookingLocation", () => {
	it("preserves a configured location", () => {
		expect(resolveBookingLocation(" 12345 ")).toBe("12345");
	});

	it("falls back for missing or blank contact data", () => {
		expect(resolveBookingLocation()).toBe(bookingLocationId);
		expect(resolveBookingLocation("")).toBe(bookingLocationId);
		expect(resolveBookingLocation("   ")).toBe(bookingLocationId);
	});
});
