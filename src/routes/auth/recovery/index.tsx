import { component$, useSignal } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import { EmailInput } from "~/components/auth/email-input";
import { supabase } from "~/shared/supabase-client";

export const useSupabaseRecovery = routeAction$(async (formData, requestEv) => {
	const recoveryResponse = await supabase(requestEv).auth.resetPasswordForEmail(
		formData.email.toString(),
		{
			redirectTo: `${requestEv.url.origin}/auth/password-recovery`,
		},
	);

	if (recoveryResponse.error) {
		console.error(
			"An error occurred during recovery:",
			recoveryResponse.error.message,
		);
		return {
			success: false,
			error: { message: recoveryResponse.error.message },
		};
	}
	return {
		success: true,
		message: "Check your email for recovery instructions",
	};
});

export default component$(() => {
	// Reactive signals for form inputs and error
	const email = useSignal("");
	const useRecovery = useSupabaseRecovery();

	return (
		<>
			<h1 class="text-3xl font-bold text-center text-primary font-qestero">
				Password Recovery
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
						"Reset"
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
