import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "./supabase-client";

// eslint-disable-next-line qwik/loader-location
export const useAuthSession = routeLoader$(async (requestEv) => {
	const {
		data: { session },
	} = await supabase(requestEv).auth.getSession();

	if (!session) {
		throw requestEv.redirect(302, "/auth/signin"); // Redirect if no session
	}

	return session;
});
