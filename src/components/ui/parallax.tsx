import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { attachScrollMotion } from "~/shared/scroll-motion";

interface ParallaxProps {
	/**
	 * `top`: for a hero at the top of the page; the content lags behind the
	 * scroll by `speed` (0.35 = moves at 35% of scroll speed).
	 * `center`: for a framed photo further down; the content drifts around the
	 * frame's centre, so scale the content up (e.g. `scale-115`) to hide edges.
	 * `fade`: the content drifts up and fades out over `fadeOutOver` pixels.
	 */
	mode?: "top" | "center" | "fade";
	speed?: number;
	fadeOutOver?: number;
	class?: string;
}

/**
 * Scroll-linked motion (motion spec 02). Transforms are written directly in
 * requestAnimationFrame, so scrolling never re-renders anything. The parent
 * element is the measured frame. Nothing moves with reduced motion.
 */
export const Parallax = component$<ParallaxProps>(
	({ mode = "top", speed = 0.35, fadeOutOver = 420, class: className }) => {
		const elRef = useSignal<HTMLElement>();

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Scroll-linked motion needs layout and window scroll.
		useVisibleTask$(({ cleanup }) => {
			const el = elRef.value;
			const frame = el?.parentElement;
			if (
				!el ||
				!frame ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches
			) {
				return;
			}

			cleanup(attachScrollMotion(el, frame, mode, speed, fadeOutOver));
		});

		return (
			<div ref={elRef} class={className}>
				<Slot />
			</div>
		);
	},
);
