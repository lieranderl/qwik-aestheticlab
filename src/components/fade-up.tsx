import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface FadeUpProps {
	delay?: number;
	duration?: number;
	threshold?: number;
	runOnce?: boolean;
	offset?: number; // Distance in pixels before element becomes visible
}

export const FadeUp = component$(
	({
		delay = 0,
		duration = 800,
		threshold = 0.1,
		runOnce = true,
		offset = 50,
	}: FadeUpProps) => {
		const visible = useSignal(false);
		const elSig = useSignal<HTMLElement>();
		const hasAnimated = useSignal(false);
		const shouldAnimate = useSignal(true); // Controls whether to animate or show immediately

		useVisibleTask$(({ cleanup }) => {
			const el = elSig.value;
			if (!el) return;

			let initialElementTop: number;

			// Check initial state on mount
			const checkInitialState = () => {
				const rect = el.getBoundingClientRect();
				initialElementTop = rect.top + window.scrollY;
				const currentScrollTop = window.scrollY;
				const isInViewport =
					rect.top < window.innerHeight - offset && rect.bottom > offset;

				// If element is above current scroll position, show immediately without animation
				if (initialElementTop < currentScrollTop - 100) {
					// Small buffer to be sure
					shouldAnimate.value = false;
					visible.value = true;
					hasAnimated.value = true;
					return;
				}

				// If element is currently in viewport and should animate
				if (isInViewport) {
					setTimeout(() => {
						visible.value = true;
						hasAnimated.value = true;
					}, delay);
				}
			};

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !hasAnimated.value) {
							if (shouldAnimate.value) {
								// Animate the element
								setTimeout(() => {
									visible.value = true;
									hasAnimated.value = true;
								}, delay);
							} else {
								// Show immediately without animation
								visible.value = true;
								hasAnimated.value = true;
							}

							if (runOnce) {
								observer.unobserve(el);
							}
						} else if (
							!runOnce &&
							!entry.isIntersecting &&
							hasAnimated.value &&
							shouldAnimate.value
						) {
							// Only reset if it was originally set to animate
							visible.value = false;
							hasAnimated.value = false;
						}
					});
				},
				{
					threshold,
					rootMargin: `${offset}px 0px -${offset}px 0px`,
				},
			);

			// Check initial state first
			checkInitialState();

			// Start observing
			observer.observe(el);

			cleanup(() => observer.disconnect());
		});

		return (
			<div
				ref={elSig}
				style={{
					"--fade-duration": `${duration}ms`,
					"--fade-delay": visible.value ? `${delay}ms` : "0ms",
				}}
				class={
					visible.value
						? shouldAnimate.value
							? "fade-up-visible"
							: "fade-up-immediate"
						: "fade-up-hidden"
				}
			>
				<Slot />
			</div>
		);
	},
);
