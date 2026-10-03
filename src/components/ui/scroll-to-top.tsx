import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { HiArrowUpOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { scrollToTarget } from "~/shared/smooth-scroll";

interface ScrollToTopProps {
	/**
	 * Scroll back to this element (e.g. the price list's category tabs) instead
	 * of the page top. The button appears once the element is well out of view.
	 */
	targetId?: string;
	/** Accessible name; defaults to "Scroll to top". */
	label?: string;
}

/** Height of the fixed header once scrolled (h-16). */
const HEADER_OFFSET = 64;

export const ScrollToTop = component$<ScrollToTopProps>(
	({ targetId, label }) => {
		const t = inlineTranslate();
		const isVisible = useSignal(false);

		useOnWindow(
			"scroll",
			$(() => {
				const target = targetId ? document.getElementById(targetId) : null;
				const threshold = target
					? target.getBoundingClientRect().top + window.scrollY + 480
					: 600;
				isVisible.value = window.scrollY > threshold;
			}),
		);

		return (
			<button
				type="button"
				onClick$={$(() => {
					const target = targetId ? document.getElementById(targetId) : null;
					const top = target
						? target.getBoundingClientRect().top +
							window.scrollY -
							HEADER_OFFSET
						: 0;
					scrollToTarget(top);
				})}
				class={[
					// Frosted and muted so it never competes with Book. Phones: same size as the directions button, stacked above it.
					"btn btn-square btn-outline fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-30 size-13 min-h-13 border-base-content/15 bg-base-100/55 text-base-content/70 shadow-none backdrop-blur-md transition-[opacity,translate,background-color,color] duration-300 ease-(--ease-smooth) hover:border-neutral hover:bg-neutral hover:text-neutral-content motion-reduce:transition-none lg:right-6 lg:bottom-6 lg:size-12 lg:min-h-12",
					isVisible.value
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-4 opacity-0",
				]}
				aria-label={label || t("app.common.scroll_to_top@@Scroll to top")}
				aria-hidden={!isVisible.value}
				tabIndex={isVisible.value ? 0 : -1}
			>
				<HiArrowUpOutline class="size-5" aria-hidden="true" />
			</button>
		);
	},
);
