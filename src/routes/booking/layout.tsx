import { component$, Slot } from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";
import { useAuthSession } from "~/shared/auth-session";
import { supabase } from "~/shared/supabase-client";
export { useAuthSession };

export const useSupabaseSignOut = routeAction$(async (_, requestEv) => {
	const { error } = await supabase(requestEv).auth.signOut();
	if (error) {
		console.log("Error signing out:", error);
		return { success: false, error: { message: error.message } };
	}
	throw requestEv.redirect(302, "/");
});

export default component$(() => {
	const authSession = useAuthSession();

	console.log(authSession.value.user);
	return <Slot />;
});
