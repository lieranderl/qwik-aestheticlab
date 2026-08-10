import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { HiArrowUpOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";

export const ScrollToTop = component$(() => {
	const t = inlineTranslate();
	const isVisible = useSignal(false);

	useOnWindow(
		"scroll",
		$(() => {
			isVisible.value = window.scrollY > 600;
		}),
	);

	return (
		<button
			type="button"
			onClick$={$(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
			class={[
				"btn btn-circle btn-ghost fixed right-4 bottom-24 z-30 shadow-sm backdrop-blur-sm transition-all duration-300 md:bottom-28",
				isVisible.value
					? "translate-y-0 opacity-100"
					: "translate-y-4 opacity-0 pointer-events-none",
			]}
			aria-label={t("app.common.scroll_to_top@@Scroll to top")}
		>
			<HiArrowUpOutline class="size-5" aria-hidden="true" />
		</button>
	);
});
