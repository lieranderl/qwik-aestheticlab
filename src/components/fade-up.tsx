import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface FadeUpProps {
	delay?: number;
	threshold?: number;
	runOnce?: boolean;
}

export const FadeUp = component$(
	({ delay = 0, threshold = 0.35, runOnce = true }: FadeUpProps) => {
		const visible = useSignal(false);
		const elSig = useSignal<HTMLElement>();
		const lastScrollY = useSignal(0);
		const initialized = useSignal(false);

		useVisibleTask$(({ cleanup }) => {
			const el = elSig.value;
			if (!el) return;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const scrollingDown = window.scrollY > lastScrollY.value;
						lastScrollY.value = window.scrollY;

						if (entry.isIntersecting) {
							if (!initialized.value) {
								// Already visible on load → show immediately
								visible.value = true;
								initialized.value = true;
								if (runOnce) observer.unobserve(el);
								return;
							}

							if (scrollingDown) {
								// Animate when scrolling down into view
								visible.value = true;
								if (runOnce) observer.unobserve(el);
							}
						}
						// ❌ do NOT set visible = false when leaving → stays visible
					});
				},
				{ threshold },
			);

			observer.observe(el);
			cleanup(() => observer.disconnect());
		});

		return (
			<div
				ref={elSig}
				style={{ animationDelay: `${delay}ms` }}
				class={visible.value ? "animate-fade-up" : "opacity-0"}
			>
				<Slot />
			</div>
		);
	},
);
