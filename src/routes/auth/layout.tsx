import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="flex flex-col items-center justify-center h-screen bg-base-200">
			<div class="w-xs mx-auto p-6 bg-base-100 rounded-2xl shadow-md space-y-6 md:w-md">
				<Slot />
			</div>
		</div>
	);
});
