import type { RequestEventAction } from "@builder.io/qwik-city";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const supabase = (event: RequestEventAction) => {
	const cookies: CookieMethodsServer = {
		getAll() {
			return Object.entries(event.cookie.getAll()).map(([name, cookie]) => ({
				name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				value: cookie?.value,
			}));
		},
		setAll(cookiesToSet) {
			for (const { name, value, options } of cookiesToSet) {
				event.cookie.set(name, value, options);
			}
		},
	};

	return createServerClient(
		event.env.get("SUPABASE_URL") ?? "",
		event.env.get("SUPABASE_KEY") ?? "",
		{ cookies },
	);
};

export const supabaseBrowser = createClient(
	import.meta.env.VITE_SUPABASE_URL || "",
	import.meta.env.VITE_SUPABASE_KEY || "",
);
