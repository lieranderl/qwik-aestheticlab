import type { RequestEventAction } from "@builder.io/qwik-city";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { isRuntimeConfigReady } from "./runtime-config";

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
		},
	);
};
