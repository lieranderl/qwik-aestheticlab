import { component$, Slot } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { localizePath, useSpeakLocale } from "qwik-speak";

export default component$(() => {
	const getPath = localizePath();
	const locale = useSpeakLocale();
	const pathtohome = getPath("/", locale.lang);
	return (
		<div class="flex flex-col items-center justify-center h-screen bg-base-200">
			<div class="flex justify-center items-center mb-4">
				<a href={pathtohome} class="link">
					<HiHomeOutline class="text-xl md:text-3xl text-primary" />
				</a>
			</div>
			<div class="w-xs mx-auto p-6 bg-base-100 rounded-2xl shadow-md space-y-6 md:w-md">
				<Slot />
			</div>
		</div>
	);
});
