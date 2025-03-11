import type { RequestEventAction } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const supabase = (requestEv: RequestEventAction) => {
	return createServerClient(
		requestEv.env.get("SUPABASE_URL") ?? "",
		requestEv.env.get("SUPABASE_KEY") ?? "",
		requestEv,
	);
};
