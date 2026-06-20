import { describe, expect, it, vi } from "vitest";
import { checkSupabaseDependency } from "./supabase-readiness";

const environment = {
	SUPABASE_URL: "https://project.supabase.co",
	SUPABASE_KEY: "sb_publishable_test",
};

describe("checkSupabaseDependency", () => {
	it("requires the expected contact row through the gettimely schema", async () => {
		const fetchImplementation = vi.fn(async () =>
			Response.json([{ id: 1 }]),
		) as unknown as typeof fetch;

		await expect(
			checkSupabaseDependency(environment, fetchImplementation),
		).resolves.toBe(true);
		expect(fetchImplementation).toHaveBeenCalledOnce();

		const [url, init] = vi.mocked(fetchImplementation).mock.calls[0];
		expect(String(url)).toContain("/rest/v1/contacts");
		expect(String(url)).toContain("id=eq.1");
		expect(new Headers(init?.headers).get("Accept-Profile")).toBe("gettimely");
	});

	it("rejects empty, unauthorized, or unreachable dependencies", async () => {
		const empty = vi.fn(async () =>
			Response.json([]),
		) as unknown as typeof fetch;
		const unauthorized = vi.fn(
			async () => new Response(null, { status: 401 }),
		) as unknown as typeof fetch;
		const unreachable = vi.fn(async () => {
			throw new Error("unreachable");
		}) as unknown as typeof fetch;

		await expect(checkSupabaseDependency(environment, empty)).resolves.toBe(
			false,
		);
		await expect(
			checkSupabaseDependency(environment, unauthorized),
		).resolves.toBe(false);
		await expect(
			checkSupabaseDependency(environment, unreachable),
		).resolves.toBe(false);
	});
});
