import { routeLoader$ } from "@builder.io/qwik-city";
import { localizePath } from "qwik-speak";
import { supabase } from "./supabase-client";

// eslint-disable-next-line qwik/loader-location
export const useAuthUser = routeLoader$(async (requestEv) => {
	console.log("useAuthUser triggered");
	// Set no-cache headers
	requestEv.headers.set(
		"Cache-Control",
		"no-store, no-cache, must-revalidate, proxy-revalidate",
	);
	requestEv.headers.set("Pragma", "no-cache");
	requestEv.headers.set("Expires", "0");
	requestEv.headers.set("Surrogate-Control", "no-store");
	const {
		data: { user },
	} = await supabase(requestEv).auth.getUser();

	if (!user) {
		const getPath = localizePath();
		throw requestEv.redirect(302, getPath("/auth/signin", requestEv.locale())); // Redirect if no session
	}

	return user;
});
