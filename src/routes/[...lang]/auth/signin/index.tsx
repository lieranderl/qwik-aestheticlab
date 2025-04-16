import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import { inlineTranslate, localizePath, useSpeakLocale } from "qwik-speak";
import { EmailInput } from "~/components/auth/email-input";
import { PasswordInput } from "~/components/auth/password-input";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseSignIn = routeAction$(async (formData, requestEv) => {
	console.log(
		"Sign in action triggered with email:",
		formData.email.toString(),
	);
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
	const getPath = localizePath();
	throw requestEv.redirect(302, getPath("/booking", requestEv.locale()));
});

export default component$(() => {
	// Reactive signals for form inputs and error
	const email = useSignal("");
	const password = useSignal("");
	const useSignIn = useSupabaseSignIn();
	const getPath = localizePath();
	const locale = useSpeakLocale();
	const signup_path = getPath("/auth/signup", locale.lang);
	const recovery_path = getPath("/auth/recovery", locale.lang);
	const t = inlineTranslate();

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
				{t("app.auth.signin@@Sign In")}
			</h1>
			<Form class="space-y-4" action={useSignIn}>
				<EmailInput emailSignal={email} />

				<PasswordInput
					password={password}
					placeholder={t("app.auth.set_password_placeh@@Enter your password")}
					minLength={6}
				/>

				<div class="flex justify-end">
					<div class="link text-sm">
						<a href={recovery_path}>
							{t("app.auth.forgot_pass@@Forgot your password?")}
						</a>
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
							<span>{t("app.auth.signin@@Sign In")}</span>
						)}
					</button>
				</div>
				<div class="flex justify-end">
					<div class="link  text-sm">
						<a href={signup_path}>
							{t("app.auth.donthaveaccount@@Don't have an account? Sign up")}
						</a>
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
