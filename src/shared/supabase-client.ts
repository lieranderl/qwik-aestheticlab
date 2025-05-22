import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { RequestEventAction } from "@builder.io/qwik-city";

export const supabase = (event: RequestEventAction) => {
	const cookies: CookieMethodsServer = {
		getAll() {
			return Object.entries(event.cookie.getAll()).map(([name, cookie]) => ({
				name,
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
