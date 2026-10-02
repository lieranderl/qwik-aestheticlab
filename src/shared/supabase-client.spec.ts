import { describe, expect, it } from "vitest";
import { supabase } from "./supabase-client";

describe("supabase", () => {
	it("returns null when SUPABASE_URL is missing", () => {
		const event = {
			env: new Map([["SUPABASE_KEY", "test-key"]]),
		} as unknown as Parameters<typeof supabase>[0];
		expect(supabase(event)).toBeNull();
	});

	it("returns null when SUPABASE_KEY is missing", () => {
		const event = {
			env: new Map([["SUPABASE_URL", "https://test.supabase.co"]]),
		} as unknown as Parameters<typeof supabase>[0];
		expect(supabase(event)).toBeNull();
	});
});

describe("supabase with valid configuration", () => {
	it("creates a client for a publishable key and HTTPS URL", () => {
		const event = {
			env: new Map([
				["SUPABASE_URL", "https://test.supabase.co"],
				["SUPABASE_KEY", "sb_publishable_test"],
			]),
		} as unknown as Parameters<typeof supabase>[0];
		expect(supabase(event)).not.toBeNull();
	});
});
