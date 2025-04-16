import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import { localizePath, useSpeakLocale } from "qwik-speak";
import { PasswordInput } from "~/components/auth/password-input";
import { useAuthSession } from "~/shared/auth-session";
import { supabase } from "~/shared/supabase-client";
export { useAuthSession };

export const useSupabasePasswordSet = routeAction$(
	async (formData, requestEv) => {
		const { data, error } = await supabase(requestEv).auth.updateUser({
			password: formData.password.toString(),
		});

		if (error) {
			console.log("Error to set the password:", error);
			return { success: false, error: { message: error.message } };
		}

		console.log(
			"Successfully changed password for existing user!",
			data.user.email,
		);

		return { success: true };
	},
);

export default component$(() => {
	useAuthSession();
	const password = useSignal("");
	const confirmPassword = useSignal("");
	const passwordMismatch = useComputed$(
		() => password.value !== confirmPassword.value,
	);

	const usePasswordSet = useSupabasePasswordSet();
	const getPath = localizePath();
	const locale = useSpeakLocale();
	const redirectPath = getPath("/auth/signin", locale.lang);

	return (
		<>
			<h1 class="text-3xl font-bold text-center text-primary font-qestero">
				Enter your new password
			</h1>
			<Form class="space-y-4" action={usePasswordSet}>
				<PasswordInput
					password={password}
					placeholder="Enter your password"
					minLength={6}
				/>
				<PasswordInput
					password={confirmPassword}
					placeholder="Confirm your password"
					minLength={6}
				/>
				{passwordMismatch.value && (
					<div class="text-error text-xs">Passwords do not match</div>
				)}
				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={
						!password.value ||
						!confirmPassword.value ||
						passwordMismatch.value ||
						usePasswordSet.isRunning ||
						(usePasswordSet.submitted && usePasswordSet.value?.success)
					}
				>
					{usePasswordSet.isRunning ? (
						<span class="loading loading-spinner me-2 loading-md" />
					) : (
						"Save"
					)}
				</button>
			</Form>

			{usePasswordSet.value?.success && (
				<div class="flex flex-col items-center">
					<p class="text-success">Password changed successfully</p>
					<p class="text-primary my-1">
						{" "}
						Go to{" "}
						<a class="link" href={redirectPath}>
							login page
						</a>
					</p>
				</div>
			)}
			<div class="flex justify-center">
				{!usePasswordSet.value?.success && (
					<p class="text-error">{usePasswordSet.value?.error?.message}</p>
				)}
			</div>
		</>
	);
});
