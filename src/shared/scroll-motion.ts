export type ScrollMotionMode = "top" | "center" | "fade";

/**
 * A framed photo pans at most this far either way. It is drawn this much
 * taller than its frame, so its edges never show and its size never changes.
 */
export const PAN_LIMIT = 60;

/** Binds rAF-throttled scroll motion and returns a cleanup function. */
export function attachScrollMotion(
	el: HTMLElement,
	frame: HTMLElement,
	mode: ScrollMotionMode,
	speed: number,
	fadeOutOver: number,
) {
	let ticking = false;
	function update() {
		ticking = false;
		const rect = frame.getBoundingClientRect();
		const scrolledPast = Math.max(0, -rect.top);
		if (mode === "fade") {
			const progress = Math.min(1, scrolledPast / fadeOutOver);
			el.style.opacity = String(1 - progress);
			el.style.transform = `translate3d(0, ${(-scrolledPast * 0.15).toFixed(1)}px, 0)`;
			return;
		}
		const offset =
			mode === "top"
				? scrolledPast * speed
				: Math.max(
						-PAN_LIMIT,
						Math.min(
							PAN_LIMIT,
							-(rect.top + rect.height / 2 - window.innerHeight / 2) * speed,
						),
					);
		el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
	}
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	update();
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
	return () => {
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onScroll);
	};
}
