import { component$, useSignal } from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";
import { inlineTranslate, localizePath } from "qwik-speak";
import { EmailInput } from "~/components/auth/email-input";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseRecovery = routeAction$(async (formData, requestEv) => {
	const getPath = localizePath();
	const t = inlineTranslate();
	const recoveryResponse = await supabase(requestEv).auth.resetPasswordForEmail(
		formData.email.toString(),
		{
			redirectTo: `${requestEv.url.origin}${getPath("/auth/password-recovery", requestEv.locale())}`,
		},
	);

	if (recoveryResponse.error) {
		console.error(
			t("app.auth.recovery_error@@An error occurred during recovery:"),
			recoveryResponse.error.message,
		);
		return {
			success: false,
			error: { message: recoveryResponse.error.message },
		};
	}
	return {
		success: true,
		message: t(
			"app.auth.recovery_success@@Check your email for recovery instructions",
		),
	};
});

export default component$(() => {
	// Reactive signals for form inputs and error
	const email = useSignal("");
	const useRecovery = useSupabaseRecovery();
	const t = inlineTranslate();

	return (
		<>
			<h1 class="text-3xl font-bold text-center text-primary font-qestero">
				{t("app.auth.recovery@@Password Recovery")}
			</h1>
			<Form class="space-y-4" action={useRecovery}>
				<EmailInput emailSignal={email} />
				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={
						!email.value ||
						useRecovery.isRunning ||
						(useRecovery.submitted && useRecovery.value?.success)
					}
				>
					{useRecovery.isRunning ? (
						<span class="loading loading-spinner me-2 loading-md" />
					) : (
						<span>{t("app.auth.reset@@Reset")}</span>
					)}
				</button>
			</Form>
			<div class="flex justify-center">
				{!useRecovery.value?.success && (
					<p class="text-error">{useRecovery.value?.error?.message}</p>
				)}
				{useRecovery.value?.success && (
					<p class="text-success">{useRecovery.value.message}</p>
				)}
			</div>
		</>
	);
});
