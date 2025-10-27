import {
	$,
	component$,
	Slot,
	useOnDocument,
	useSignal,
} from "@builder.io/qwik";

interface FadeUpProps {
	delay?: number;
	duration?: number;
	threshold?: number;
	runOnce?: boolean;
	rootMargin?: number;
	easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
	distance?: number;
	disable?: boolean;
	className?: string;
}

export const FadeUp = component$(
	({
		delay = 0,
		duration = 800,
		threshold = 0.1,
		runOnce = true,
		rootMargin = 50,
		easing = "ease-out",
		distance = 60,
		disable = false,
		className = "",
	}: FadeUpProps) => {
		const elRef = useSignal<HTMLElement>();
		const state = useSignal<"hidden" | "visible" | "immediate" | "disabled">(
			disable ? "disabled" : "hidden",
		);

		useOnDocument(
			"DOMContentLoaded",
			$(() => {
				// SSR safety check
				if (typeof window === "undefined" || typeof document === "undefined") {
					state.value = "immediate";
					return;
				}

				const el = elRef.value;
				if (!el) return;

				if (disable) {
					state.value = "disabled";
					return;
				}

				const rect = el.getBoundingClientRect();

				// Above viewport on load → show immediately
				if (rect.top < 0) {
					state.value = "immediate";
					return;
				}

				// Already visible on load
				if (
					rect.top < window.innerHeight - rootMargin &&
					rect.bottom > rootMargin
				) {
					state.value = delay > 0 ? "visible" : "immediate";
				}

				// Check if IntersectionObserver is supported
				if (!("IntersectionObserver" in window)) {
					state.value = "immediate";
					return;
				}

				let observer: IntersectionObserver | null = null;

				try {
					observer = new IntersectionObserver(
						([entry]) => {
							if (entry?.isIntersecting) {
								state.value = "visible";
								if (runOnce && observer) observer.disconnect();
							} else if (!runOnce) {
								state.value = "hidden";
							}
						},
						{
							threshold,
							rootMargin: `${rootMargin}px 0px -${rootMargin}px 0px`,
						},
					);
					observer.observe(el);
				} catch (error) {
					// Fallback for any IntersectionObserver errors
					console.warn(
						"IntersectionObserver error, showing content immediately",
						error,
					);
					state.value = "immediate";
				}

				// Return cleanup function
				return () => {
					if (observer) {
						observer.disconnect();
					}
				};
			}),
		);

		const classMap = {
			hidden: "fade-up-hidden",
			visible: "fade-up-visible",
			immediate: "fade-up-immediate",
			disabled: "fade-up-disabled",
		};

		return (
			<div
				ref={elRef}
				style={{
					"--fade-duration": `${duration}ms`,
					"--fade-delay": `${delay}ms`,
					"--fade-distance": `${distance}px`,
					"--fade-easing": easing,
				}}
				class={`${classMap[state.value]} ${className}`.trim()}
			>
				<Slot />
			</div>
		);
	},
);
