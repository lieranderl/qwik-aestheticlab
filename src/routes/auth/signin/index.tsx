import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import { EmailInput } from "~/components/auth/email-input";
import { PasswordInput } from "~/components/auth/password-input";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseSignIn = routeAction$(async (formData, requestEv) => {
	const signInResponse = await supabase(requestEv).auth.signInWithPassword({
		email: formData.email.toString(),
		password: formData.password.toString(),
	});

	if (signInResponse.error) {
		console.error(
			"An error occurred during sign-in:",
			signInResponse.error.message,
		);
		return { success: false, error: { message: signInResponse.error.message } };
	}
	console.log("Successfully signed in existing user!", formData.email);
	throw requestEv.redirect(302, "/booking");
});

export default component$(() => {
	// Reactive signals for form inputs and error
	const email = useSignal("");
	const password = useSignal("");
	const useSignIn = useSupabaseSignIn();

	useOnDocument(
		"DOMContentLoaded",
		$(async () => {
			console.log("IMPORT CALLY");
			await import("cally");
		}),
	);

	return (
		<>
			<h1 class="text-3xl font-bold text-center text-primary font-qestero">
				Sign In
			</h1>
			<Form class="space-y-4" action={useSignIn}>
				<EmailInput emailSignal={email} />

				<PasswordInput
					password={password}
					placeholder="Enter your password"
					minLength={6}
				/>

				<div class="flex justify-end">
					<div class="link text-sm">
						<a href="/auth/recovery">Forgot your password?</a>
					</div>
				</div>
				<div>
					<button
						type="submit"
						class="btn btn-primary w-full"
						disabled={
							!email.value || password.value.length < 6 || useSignIn.isRunning
						}
					>
						{useSignIn.isRunning ? (
							<span class="loading loading-spinner me-2 loading-md" />
						) : (
							"Login"
						)}
					</button>
				</div>
				<div class="flex justify-end">
					<div class="link  text-sm">
						<a href="/auth/signup">Don't have an account? Sign up</a>
					</div>
				</div>
			</Form>

			<div class="flex justify-center">
				{!useSignIn.value?.success && (
					<p class="text-error">{useSignIn.value?.error.message}</p>
				)}
			</div>
		</>
	);
});
