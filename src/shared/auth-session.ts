import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "./supabase-client";
import { localizePath } from "qwik-speak";

// eslint-disable-next-line qwik/loader-location
export const useAuthSession = routeLoader$(async (requestEv) => {
	console.log("useAuthSession triggered");
	const {
		data: { session },
	} = await supabase(requestEv).auth.getSession();

	if (!session) {
		const getPath = localizePath();
		throw requestEv.redirect(302, getPath("/auth/signin", requestEv.locale())); // Redirect if no session
	}

	return session;
});
