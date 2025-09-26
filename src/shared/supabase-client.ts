import type { RequestEventAction } from "@builder.io/qwik-city";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";

export const supabase = (event: RequestEventAction) => {
	const cookies: CookieMethodsServer = {
		getAll: () => [
			// Extract cookies from the request headers
		],
		setAll: () => {
			// No-op: We don't need to set cookies in this example
		},
	};

	return createServerClient(
		event.env.get("SUPABASE_URL") ?? "",
		event.env.get("SUPABASE_KEY") ?? "",
		{
			cookies,
		},
	);
};
