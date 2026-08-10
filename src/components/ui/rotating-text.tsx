import { component$ } from "@builder.io/qwik";
import { HiChevronDownOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";

export const RotatingText = component$(() => {
	const t = inlineTranslate();

	return (
		<div class="mx-auto w-full max-w-5xl text-center">
			<span class="sr-only">
				{t("app.hero.the_best@@The best")} {t("app.hero.manicure@@manicure")},{" "}
				{t("app.hero.pedicure@@pedicure")}, {t("app.hero.brows@@brows")},{" "}
				{t("app.hero.lashes@@lashes")}, {t("app.hero.laser@@laser")}{" "}
				{t("app.hero.in_leuven@@in Leuven")}
			</span>

			<div
				data-testid="hero-service-line"
				class="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-1 text-balance text-primary-content sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1 md:gap-x-4"
				aria-hidden="true"
			>
				<span class="font-montserrat text-xl leading-tight font-light md:text-2xl">
					{t("app.hero.the_best@@The best")}
				</span>

				<span
					data-testid="hero-text-rotate"
					class="text-rotate w-36 max-w-full font-montserrat text-2xl leading-normal font-semibold text-accent duration-10000 md:w-44 md:text-3xl"
				>
					<span class="justify-items-center">
						<span>{t("app.hero.manicure@@manicure")}</span>
						<span>{t("app.hero.pedicure@@pedicure")}</span>
						<span>{t("app.hero.brows@@brows")}</span>
						<span>{t("app.hero.lashes@@lashes")}</span>
						<span>{t("app.hero.laser@@laser")}</span>
					</span>
				</span>

				<span class="font-montserrat text-xl leading-tight font-light md:text-2xl">
					{t("app.hero.in_leuven@@in Leuven")}
				</span>
			</div>

			<p
				data-testid="hero-service-footnote"
				class="mt-2 text-center font-montserrat text-xs leading-relaxed text-primary-content"
			>
				{t("app.hero.according@@*according to our clients")}
			</p>
		</div>
	);
});

export const ScrollDownHint = component$(() => {
	const t = inlineTranslate();

	return (
		<a
			href="#services"
			class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8 lg:bottom-10"
			aria-label={t("app.hero.scroll_down@@Scroll down to see our services")}
		>
			<span class="font-montserrat text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary-content">
				{t("app.hero.scroll@@Scroll")}
			</span>
			<HiChevronDownOutline
				class="size-5 text-primary-content motion-safe:animate-bounce"
				aria-hidden="true"
			/>
		</a>
	);
});
