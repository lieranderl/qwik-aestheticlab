import type Lenis from "lenis";

let activeLenis: Lenis | undefined;

/** True when smooth scrolling should run: a fine pointer and no reduced motion. */
export function shouldSmoothScroll(win: Pick<Window, "matchMedia">): boolean {
	return (
		win.matchMedia("(hover: hover) and (pointer: fine)").matches &&
		!win.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

/** Starts Lenis on desktop and returns a function that stops it. */
export async function startSmoothScroll(): Promise<(() => void) | undefined> {
	if (!shouldSmoothScroll(window)) return undefined;
	const { default: LenisClass } = await import("lenis");
	const lenis = new LenisClass({ autoRaf: true, anchors: true, lerp: 0.1 });
	activeLenis = lenis;
	return () => {
		if (activeLenis === lenis) activeLenis = undefined;
		lenis.destroy();
	};
}

/**
 * Scrolls to an element's top (honouring its scroll-margin-top) or to a page
 * offset. Lenis owns the scroll position on desktop, so native smooth
 * scrolling would be undone there; this goes through Lenis when it runs.
 */
export function scrollToTarget(target: HTMLElement | number): void {
	const reducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const top =
		typeof target === "number"
			? target
			: target.getBoundingClientRect().top +
				window.scrollY -
				(Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
	const destination = Math.max(0, top);
	if (activeLenis) {
		activeLenis.scrollTo(destination, { immediate: reducedMotion });
		return;
	}
	window.scrollTo({
		top: destination,
		behavior: reducedMotion ? "auto" : "smooth",
	});
}
