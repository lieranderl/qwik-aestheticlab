import { component$, Slot } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { localizePath, useSpeakLocale } from "qwik-speak";

export default component$(() => {
	const locale = useSpeakLocale();
	const getPath = localizePath();
	const pathtohome = getPath("/", locale.lang);
	return (
		<div class="min-h-screen bg-base-100 text-base-content p-2 md:p-6">
			<div class="max-w-3xl mx-auto bg-base-200 p-4 rounded-box shadow-lg">
				<div class="flex justify-center mb-4">
					<a href={pathtohome} class="link">
						<HiHomeOutline class="text-xl md:text-3xl text-primary" />
					</a>
				</div>
				<Slot />
			</div>
		</div>
	);
});
