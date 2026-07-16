import {
	component$,
	type PropFunction,
	Slot,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";

interface SharedObserverEntry {
	callbacks: WeakMap<Element, (entry: IntersectionObserverEntry) => void>;
	observer: IntersectionObserver;
}

const sharedObservers = new Map<string, SharedObserverEntry>();

function getSharedObserver(rootMargin: number, threshold: number) {
	const key = `${rootMargin}:${threshold}`;
	const existing = sharedObservers.get(key);
	if (existing) return existing;

	const callbacks = new WeakMap<
		Element,
		(entry: IntersectionObserverEntry) => void
	>();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				callbacks.get(entry.target)?.(entry);
			}
		},
		{
			threshold,
			rootMargin: `${rootMargin}px 0px -${rootMargin}px 0px`,
		},
	);

	const shared = { callbacks, observer };
	sharedObservers.set(key, shared);
	return shared;
}

interface FadeUpProps {
	delay?: number;
	duration?: number;
	threshold?: number;
	runOnce?: boolean;
	rootMargin?: number;
	easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
	distance?: number;
	direction?: "up" | "down" | "left" | "right";
	disable?: boolean;
	class?: string;
	onClick$?: PropFunction<() => void>;
}

export const FadeUp = component$(
	({
		delay = 0,
		duration = 320,
		threshold = 0.1,
		runOnce = true,
		rootMargin = 50,
		easing = "ease-out",
		distance = 16,
		direction = "up",
		disable = false,
		class: className = "",
		onClick$,
	}: FadeUpProps) => {
		const elRef = useSignal<HTMLElement>();
		const state = useSignal<"hidden" | "visible" | "immediate" | "disabled">(
			disable ? "disabled" : "hidden",
		);

		// eslint-disable-next-line qwik/no-use-visible-task
		// biome-ignore lint: qwik/no-use-visible-task
		useVisibleTask$(({ cleanup }) => {
			const el = elRef.value;
			if (!el) return;

			if (disable) {
				state.value = "disabled";
				return;
			}

			const rect = el.getBoundingClientRect();

			// Above viewport on load → show immediately
			if (rect.top + window.scrollY < window.scrollY) {
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

			const sharedObserver = getSharedObserver(rootMargin, threshold);
			sharedObserver.callbacks.set(el, (entry) => {
				if (entry.isIntersecting) {
					state.value = "visible";
					if (runOnce) {
						sharedObserver.observer.unobserve(el);
						sharedObserver.callbacks.delete(el);
					}
				} else if (!runOnce) {
					state.value = "hidden";
				}
			});

			sharedObserver.observer.observe(el);
			cleanup(() => {
				sharedObserver.observer.unobserve(el);
				sharedObserver.callbacks.delete(el);
			});
		});

		const classMap = {
			hidden: `fade-${direction}-hidden`,
			visible: `fade-${direction}-visible`,
			immediate: `fade-${direction}-immediate`,
			disabled: `fade-${direction}-disabled`,
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
				class={`fade-motion ${classMap[state.value]} ${className}`.trim()}
				onClick$={onClick$}
			>
				<Slot />
			</div>
		);
	},
);
