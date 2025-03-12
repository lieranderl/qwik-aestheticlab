import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { HiExclamationCircleOutline } from "@qwikest/icons/heroicons";

export const useAuthCodeError = routeLoader$(({ query }) => {
	return query.get("error");
});

export default component$(() => {
	const error = useAuthCodeError();

	return (
		<>
			<div class="text-center">
				<h1 class="text-2xl font-extrabold text-error">Authentication Error</h1>
				<div class="text-secondary mt-2">
					Oops! Something went wrong during the login process.
				</div>
			</div>

			{error.value && (
				<div role="alert" class="alert alert-error alert-soft">
					<HiExclamationCircleOutline class="text-error w-6 h-6" />
					{error.value}
				</div>
			)}

			<div class="text-center">
				<a href="/" class="btn btn-primary mt-4">
					Back to Home
				</a>
			</div>
		</>
	);
});
