import type { RequestEventAction } from "@qwik.dev/router";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { isRuntimeConfigReady } from "./runtime-config";

/**
 * Upper bound for one Supabase query so a slow upstream cannot stall SSR.
 * Retries are disabled so this is the total wait, not a per-attempt budget.
 */
export const SUPABASE_REQUEST_TIMEOUT_MS = 3000;

export const supabase = (event: RequestEventAction) => {
	const environment = {
		SUPABASE_URL: event.env.get("SUPABASE_URL"),
		SUPABASE_KEY: event.env.get("SUPABASE_KEY"),
	};

	if (!isRuntimeConfigReady(environment)) return null;

	const cookies: CookieMethodsServer = {
		getAll: () => [
			// Extract cookies from the request headers
		],
		setAll: () => {
			// No-op: We don't need to set cookies in this example
		},
	};
	return createServerClient(
		environment.SUPABASE_URL ?? "",
		environment.SUPABASE_KEY ?? "",
		{
			cookies,
			db: {
				timeout: SUPABASE_REQUEST_TIMEOUT_MS,
				retry: false,
			},
		},
	);
};
