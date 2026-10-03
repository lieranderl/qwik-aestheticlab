import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { startSmoothScroll } from "~/shared/smooth-scroll";

/**
 * Lenis smooth scrolling for mouse and trackpad users. Touch devices keep
 * their native scrolling, and nothing changes with reduced motion.
 */
export const SmoothScroll = component$(() => {
	// biome-ignore lint/correctness/noQwikUseVisibleTask: Lenis needs the window and wheel events.
	useVisibleTask$(
		({ cleanup }) => {
			let stop: (() => void) | undefined;
			let cancelled = false;
			startSmoothScroll().then((dispose) => {
				if (cancelled) dispose?.();
				else stop = dispose;
			});
			cleanup(() => {
				cancelled = true;
				stop?.();
			});
		},
		{ strategy: "document-ready" },
	);

	return <span hidden />;
});
