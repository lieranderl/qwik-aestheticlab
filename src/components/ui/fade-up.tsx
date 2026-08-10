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

export interface FadeUpProps {
	delay?: number;
	threshold?: number;
	runOnce?: boolean;
	rootMargin?: number;
	direction?: "up" | "down" | "left" | "right";
	disable?: boolean;
	class?: string;
	onClick$?: PropFunction<() => void>;
}

export const FadeUp = component$(
	({
		delay = 0,
		threshold = 0.1,
		runOnce = true,
		rootMargin = 50,
		direction = "up",
		disable = false,
		class: className = "",
		onClick$,
	}: FadeUpProps) => {
		const elRef = useSignal<HTMLElement>();
		const state = useSignal<"hidden" | "visible" | "immediate" | "disabled">(
			disable ? "disabled" : "hidden",
		);

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Visibility animation requires IntersectionObserver and layout bounds.
		useVisibleTask$(({ cleanup }) => {
			const el = elRef.value;
			if (!el) return;

			if (
				disable ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches
			) {
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
				if (runOnce) return;
			}

			state.value = "hidden";
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

		const hiddenClassMap = {
			up: "motion-safe:[.js_&]:translate-y-12 motion-safe:[.js_&]:opacity-0",
			down: "motion-safe:[.js_&]:-translate-y-12 motion-safe:[.js_&]:opacity-0",
			left: "motion-safe:[.js_&]:translate-x-10 motion-safe:[.js_&]:opacity-0",
			right:
				"motion-safe:[.js_&]:-translate-x-10 motion-safe:[.js_&]:opacity-0",
		};
		const visibilityClass =
			state.value === "hidden"
				? hiddenClassMap[direction]
				: "translate-x-0 translate-y-0 opacity-100";
		const transitionClass =
			state.value === "hidden" || state.value === "visible"
				? "motion-safe:transition-[opacity,transform] motion-safe:duration-400 motion-safe:ease-[var(--ease-smooth)]"
				: "transition-none";

		// Clamp delay to 0-300 range, round to nearest 20ms
		const clampedDelay = Math.min(
			300,
			Math.max(0, Math.round(delay / 20) * 20),
		);

		return (
			<div
				ref={elRef}
				data-fade-up
				class={[
					transitionClass,
					visibilityClass,
					clampedDelay > 0 ? `motion-safe:delay-[${clampedDelay}ms]` : "",
					"motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
					className,
				]}
				onClick$={onClick$}
			>
				<Slot />
			</div>
		);
	},
);
