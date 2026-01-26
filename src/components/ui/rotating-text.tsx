import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export const RotatingText = component$(() => {
	const t = inlineTranslate();

	return (
		<div class="font-montserrat mx-auto max-w-xl">
			<div class="text-xl md:text-2xl font-medium text-primary-content tracking-wide mb-2 flex flex-col md:flex-row items-center justify-center gap-2">
				<span>{t("app.hero.the_best@@The best")}</span>

				<span class="text-rotate text-left overflow-hidden inline-flex flex-col">
					<span class="font-bold justify-items-center">
						<span class="block px-2 text-pink-500 ">
							{t("app.hero.manicure@@manicure")}
						</span>
						<span class="block px-2 text-rose-500 ">
							{t("app.hero.pedicure@@pedicure")}
						</span>
						<span class="block px-2 text-fuchsia-600 ">
							{t("app.hero.brows@@brows")}
						</span>
						<span class="block px-2 text-violet-600">
							{t("app.hero.lashes@@lashes")}
						</span>
						<span class="block px-2 text-indigo-600">
							{t("app.hero.laser@@laser")}
						</span>
					</span>
				</span>

				<span>{t("app.hero.in_leuven@@in Leuven")}</span>
			</div>
			<p class="text-xs opacity-60">
				{t("app.hero.according@@*voted by our clients")}
			</p>
		</div>
	);
});
