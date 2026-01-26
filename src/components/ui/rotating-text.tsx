import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export const RotatingText = component$(() => {
	const t = inlineTranslate();

	return (
		<div class="font-montserrat mx-auto max-w-xl text-neutral-content/80">
			<div class="text-lg md:text-xl font-normal tracking-wide mb-2 flex flex-col md:flex-row items-center justify-center gap-2">
				<span>{t("app.hero.the_best@@The best")}</span>

				<span class="text-rotate text-left overflow-hidden inline-flex flex-col">
					<span class="font-bold justify-items-center">
						<span class="block px-2 text-warning ">
							{t("app.hero.manicure@@manicure")}
						</span>
						<span class="block px-2 text-secondary ">
							{t("app.hero.pedicure@@pedicure")}
						</span>
						<span class="block px-2 text-accent ">
							{t("app.hero.brows@@brows")}
						</span>
						<span class="block px-2 text-info">
							{t("app.hero.lashes@@lashes")}
						</span>
						<span class="block px-2 text-success">
							{t("app.hero.laser@@laser")}
						</span>
						{/* Duplicate first item for seamless loop */}
						<span class="block px-2 text-warning ">
							{t("app.hero.manicure@@manicure")}
						</span>
					</span>
				</span>

				<span>{t("app.hero.in_leuven@@in Leuven")}</span>
			</div>
			<p class="text-xs  tracking-[0.2em] opacity-60">
				{t("app.hero.according@@*voted by our clients")}
			</p>
		</div>
	);
});
