import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export const RotatingText = component$(() => {
	const t = inlineTranslate();
	const rootRef = useSignal<HTMLElement>();
	const isVisible = useSignal(false);

	// eslint-disable-next-line qwik/no-use-visible-task
	// biome-ignore lint: CSS animation needs viewport-aware play state.
	useVisibleTask$(({ cleanup }) => {
		const root = rootRef.value;
		if (!root) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible.value = entry?.isIntersecting ?? false;
			},
			{ threshold: 0.05 },
		);
		observer.observe(root);
		cleanup(() => observer.disconnect());
	});

	return (
		<div ref={rootRef} class="mx-auto w-full max-w-5xl text-center">
			<span class="sr-only">
				{t("app.hero.the_best@@The best")} {t("app.hero.manicure@@manicure")},{" "}
				{t("app.hero.pedicure@@pedicure")}, {t("app.hero.brows@@brows")},{" "}
				{t("app.hero.lashes@@lashes")}, {t("app.hero.laser@@laser")}{" "}
				{t("app.hero.in_leuven@@in Leuven")}
			</span>
			<div
				data-testid="hero-service-line"
				class="mx-auto text-white flex w-full max-w-5xl flex-col items-center justify-center gap-0.5 text-balance sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1 md:gap-x-4"
				aria-hidden="true"
			>
				<span class="font-montserrat text-xl leading-tight font-medium md:text-2xl">
					{t("app.hero.the_best@@The best")}
				</span>

				<span
					data-testid="hero-text-rotate"
					class="text-rotate w-40 max-w-full font-inter text-2xl leading-normal font-extrabold duration-10000 md:text-3xl"
				>
					<span
						class={[
							"hero-text-rotate-track justify-items-center",
							!isVisible.value && "[animation-play-state:paused]",
						]}
					>
						<span class="text-accent">{t("app.hero.manicure@@manicure")}</span>
						<span class="text-primary">{t("app.hero.pedicure@@pedicure")}</span>
						<span class="text-secondary">{t("app.hero.brows@@brows")}</span>
						<span class="text-accent/85">{t("app.hero.lashes@@lashes")}</span>
						<span class="text-primary/85">{t("app.hero.laser@@laser")}</span>
					</span>
				</span>

				<span class="font-montserrat text-xl leading-tight font-medium md:text-2xl">
					{t("app.hero.in_leuven@@in Leuven")}
				</span>
			</div>
			<p
				data-testid="hero-service-footnote"
				class="mt-3 text-center font-montserrat text-xs leading-relaxed text-base-content/65"
			>
				{t("app.hero.according@@*according to our clients")}
			</p>
		</div>
	);
});
