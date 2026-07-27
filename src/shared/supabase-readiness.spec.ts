import { describe, expect, it, vi } from "vitest";
import {
	checkSupabaseDependency,
	isSupabaseDependencyReady,
} from "./supabase-readiness";

const environment = {
	SUPABASE_URL: "https://project.supabase.co",
	SUPABASE_KEY: "sb_publishable_test",
};

describe("checkSupabaseDependency", () => {
	it("requires the expected contact row through the gettimely schema", async () => {
		const fetchImplementation = vi.fn(
			async (_input: URL, _init?: RequestInit) => Response.json([{ id: 1 }]),
		);

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
		const empty = vi.fn(async () => Response.json([]));
		const unauthorized = vi.fn(async () => new Response(null, { status: 401 }));
		const unreachable = vi.fn(async () => {
			throw new Error("unreachable");
		});

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

describe("isSupabaseDependencyReady", () => {
	it("delegates to checkSupabaseDependency with the environment", async () => {
		const fetchOk = vi.fn(async () => Response.json([{ id: 1 }]));

		const result = await isSupabaseDependencyReady(environment, fetchOk);

		expect(result).toBe(true);
		expect(fetchOk).toHaveBeenCalledOnce();
	});
});
