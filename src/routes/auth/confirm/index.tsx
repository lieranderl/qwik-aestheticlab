import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseAuthConfirm = routeLoader$(async (req) => {
	const token_hash = req.query.get("token_hash");
	const type = req.query.get("type") as EmailOtpType | null;
	const next = req.query.get("next") ?? "/";

	console.log("token_hash", token_hash);
	console.log("type", type);
	console.log("next", next);

	if (token_hash && type) {
		const { error } = await supabase(req).auth.verifyOtp({
			type,
			token_hash,
		});
		if (!error) {
			console.log("Successfully verified OTP");
			throw req.redirect(303, `/${next}`);
		}
		console.error("Failed to verify OTP", error);
	}

	// return the user to an error page with some instructions
	throw req.redirect(303, "/auth/auth-code-error");
});

export default component$(() => {
	return <></>;
});
