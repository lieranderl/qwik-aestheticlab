import { component$, Slot } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { localizePath, useSpeakLocale } from "qwik-speak";
import { LanguageSwitcher } from "~/components/ui/language-switcher";

export default component$(() => {
	const locale = useSpeakLocale();
	const getPath = localizePath();
	const pathtohome = getPath("/", locale.lang);
	return (
		<div class="min-h-screen bg-base-200 text-base-content px-1 md:px-8">
			<div class="max-w-3xl mx-auto bg-transparent p-8 rounded-2xl">
				<div class="flex justify-between items-center mb-12 p-8">
					<a href={pathtohome} class="link">
						<HiHomeOutline class="text-xl md:text-3xl text-primary" />
					</a>
					<LanguageSwitcher />
				</div>
				<Slot />
			</div>
		</div>
	);
});
