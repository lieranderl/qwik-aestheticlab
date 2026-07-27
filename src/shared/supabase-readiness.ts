import { isRuntimeConfigReady } from "./runtime-config";

type RuntimeEnvironment = Record<string, string | undefined>;
type FetchImplementation = (
	input: URL,
	init?: RequestInit,
) => Promise<Response>;

export async function checkSupabaseDependency(
	environment: RuntimeEnvironment,
	fetchImplementation: FetchImplementation = fetch,
) {
	if (!isRuntimeConfigReady(environment)) return false;

	const supabaseUrl = environment.SUPABASE_URL as string;
	const supabaseKey = environment.SUPABASE_KEY as string;
	const endpoint = new URL("/rest/v1/contacts", supabaseUrl);
	endpoint.searchParams.set("select", "id");
	endpoint.searchParams.set("id", "eq.1");
	endpoint.searchParams.set("limit", "1");

	try {
		const response = await fetchImplementation(endpoint, {
			headers: {
				Accept: "application/json",
				"Accept-Profile": "gettimely",
				Authorization: `Bearer ${supabaseKey}`,
				apikey: supabaseKey,
			},
			cache: "no-store",
			signal: AbortSignal.timeout(3000),
		});

		if (!response.ok) return false;
		const data = (await response.json()) as unknown;
		return Array.isArray(data) && data.length === 1;
	} catch {
		return false;
	}
}

let cachedResult = false;
let cacheExpiresAt = 0;
let pendingCheck: Promise<boolean> | undefined;

export async function isSupabaseDependencyReady(
	environment: RuntimeEnvironment,
	fetchImplementation: FetchImplementation = fetch,
) {
	const now = Date.now();
	if (now < cacheExpiresAt) return cachedResult;
	if (pendingCheck) return pendingCheck;

	pendingCheck = checkSupabaseDependency(environment, fetchImplementation).then(
		(result) => {
			cachedResult = result;
			cacheExpiresAt = Date.now() + (result ? 30_000 : 5_000);
			pendingCheck = undefined;
			return result;
		},
	);

	return pendingCheck;
}
