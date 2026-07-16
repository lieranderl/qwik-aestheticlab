import { component$, Slot } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate, localizePath, useSpeakLocale } from "qwik-speak";
import { LanguageSwitcher } from "~/components/ui/language-switcher";

export default component$(() => {
	const locale = useSpeakLocale();
	const getPath = localizePath();
	const pathtohome = getPath("/", locale.lang);
	const t = inlineTranslate();
	return (
		<div class="min-h-screen bg-base-200 px-4 text-base-content sm:px-6 md:px-8">
			<div class="mx-auto max-w-3xl py-3 sm:py-4 md:py-6">
				<header class="surface-card sticky top-3 z-30 mb-8 flex items-center justify-between bg-base-100/98 p-2 md:mb-10">
					<a
						href={pathtohome}
						class="btn btn-ghost min-h-11 gap-2 px-3"
						aria-label={t("app.nav.home@@Home")}
					>
						<HiHomeOutline class="text-xl text-primary" aria-hidden="true" />
						<span class="font-montserrat text-sm font-semibold">
							{t("app.nav.home@@Home")}
						</span>
					</a>
					<LanguageSwitcher />
				</header>
				<Slot />
			</div>
		</div>
	);
});
