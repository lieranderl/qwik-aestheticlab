import { component$ } from "@qwik.dev/core";
import { HiChevronDownOutline } from "@qwikest/icons/heroicons";
import { _ } from "compiled-i18n";

export const RotatingText = component$(() => {
	return (
		<div class="mx-auto w-full max-w-5xl text-center">
			<span class="sr-only">
				{_`hero.the_best`} {_`hero.manicure`}, {_`hero.pedicure`},{" "}
				{_`hero.brows`}, {_`hero.lashes`}, {_`hero.laser`} {_`hero.in_leuven`}
			</span>

			<div
				data-testid="hero-service-line"
				class="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-1 text-balance text-primary-content sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1 md:gap-x-4"
				aria-hidden="true"
			>
				<span class="font-main text-xl leading-tight font-light md:text-2xl">
					{_`hero.the_best`}
				</span>

				<span
					data-testid="hero-text-rotate"
					class="text-rotate w-36 max-w-full font-main text-2xl leading-normal font-semibold text-primary-content duration-10000 md:w-44 md:text-3xl"
				>
					<span class="justify-items-center">
						<span>{_`hero.manicure`}</span>
						<span class="text-secondary">{_`hero.pedicure`}</span>
						<span class="text-accent">{_`hero.brows`}</span>
						<span class="text-info">{_`hero.lashes`}</span>
						<span class="text-error">{_`hero.laser`}</span>
					</span>
				</span>

				<span class="font-main text-xl leading-tight font-light md:text-2xl">
					{_`hero.in_leuven`}
				</span>
			</div>

			<p
				data-testid="hero-service-footnote"
				class="mt-2 text-center font-main text-xs leading-relaxed text-primary-content"
			>
				{_`hero.according`}
			</p>
		</div>
	);
});

export const ScrollDownHint = component$(() => {
	return (
		<a
			href="#services"
			class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8 lg:bottom-10"
			aria-label={_`hero.scroll_down`}
		>
			<span class="font-main text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary-content">
				{_`hero.scroll`}
			</span>
			<HiChevronDownOutline
				class="size-5 text-primary-content motion-safe:animate-bounce"
				aria-hidden="true"
			/>
		</a>
	);
});
