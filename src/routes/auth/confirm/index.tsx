import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseAuthConfirm = routeLoader$(async (req) => {
	const token_hash = req.query.get("token_hash");
	const type = req.query.get("type") as
		| "email"
		| "signup"
		| "invite"
		| "magiclink"
		| "recovery"
		| "email_change"
		| null;
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
			throw req.redirect(303, `${req.url.origin}/${next}`);
		}
		console.error("Failed to verify OTP", error);
		throw req.redirect(303, `/auth/auth-code-error?error=${error.message}`);
	}

	throw req.redirect(303, "/auth/auth-code-error?error=no token hash or type");
});

export default component$(() => {
	return <></>;
});
