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
	let lastTransform = "";
	let lastOpacity = "";
	// Only touch the DOM when a value changes, so idle frames cost nothing.
	function apply(transform: string, opacity?: string) {
		if (transform !== lastTransform) {
			el.style.transform = transform;
			lastTransform = transform;
		}
		if (opacity !== undefined && opacity !== lastOpacity) {
			el.style.opacity = opacity;
			lastOpacity = opacity;
		}
	}
	function update() {
		ticking = false;
		const rect = frame.getBoundingClientRect();
		const scrolledPast = Math.max(0, -rect.top);
		if (mode === "fade") {
			const progress = Math.min(1, scrolledPast / fadeOutOver);
			apply(
				`translate3d(0, ${(-Math.min(scrolledPast, fadeOutOver) * 0.15).toFixed(1)}px, 0)`,
				String(Math.round((1 - progress) * 1000) / 1000),
			);
			return;
		}
		const offset =
			mode === "top"
				? // Stops once the frame is off screen, so nothing moves out of sight.
					Math.min(scrolledPast, rect.height) * speed
				: Math.max(
						-PAN_LIMIT,
						Math.min(
							PAN_LIMIT,
							-(rect.top + rect.height / 2 - window.innerHeight / 2) * speed,
						),
					);
		apply(`translate3d(0, ${offset.toFixed(1)}px, 0)`);
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
