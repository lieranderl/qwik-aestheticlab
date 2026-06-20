import { describe, expect, it } from "vitest";
import { isRuntimeConfigReady } from "./runtime-config";

const anonKey = [
	"eyJhbGciOiJIUzI1NiJ9",
	"eyJyb2xlIjoiYW5vbiJ9",
	"ci-placeholder",
].join(".");
const serviceRoleKey = [
	"eyJhbGciOiJIUzI1NiJ9",
	"eyJyb2xlIjoic2VydmljZV9yb2xlIn0",
	"ci-placeholder",
].join(".");

describe("isRuntimeConfigReady", () => {
	it("accepts publishable and legacy anon keys over HTTPS", () => {
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "https://example.supabase.co",
				SUPABASE_KEY: "sb_publishable_example",
			}),
		).toBe(true);
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "https://example.supabase.co",
				SUPABASE_KEY: anonKey,
			}),
		).toBe(true);
	});

	it("rejects missing, privileged, malformed, and insecure configuration", () => {
		expect(isRuntimeConfigReady({})).toBe(false);
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "https://example.supabase.co",
				SUPABASE_KEY: serviceRoleKey,
			}),
		).toBe(false);
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "https://example.supabase.co",
				SUPABASE_KEY: "sb_secret_example",
			}),
		).toBe(false);
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "http://example.com",
				SUPABASE_KEY: anonKey,
			}),
		).toBe(false);
	});

	it("permits HTTP only for local Supabase development", () => {
		expect(
			isRuntimeConfigReady({
				SUPABASE_URL: "http://127.0.0.1:54321",
				SUPABASE_KEY: anonKey,
			}),
		).toBe(true);
	});
});
