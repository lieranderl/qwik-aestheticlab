import { afterEach, describe, expect, test, vi } from "vitest";
import { attachScrollMotion } from "./scroll-motion";

function setup(top: number, height = 800) {
	const listeners = new Map<string, () => void>();
	vi.stubGlobal("window", {
		innerHeight: 800,
		addEventListener: (type: string, fn: () => void) => listeners.set(type, fn),
		removeEventListener: (type: string) => listeners.delete(type),
	});
	vi.stubGlobal("requestAnimationFrame", (fn: () => void) => fn());
	const rect = { top, height };
	const frame = {
		getBoundingClientRect: () => rect,
	} as unknown as HTMLElement;
	const el = { style: {} as Record<string, string> } as unknown as HTMLElement;
	return { el, frame, rect, listeners };
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("attachScrollMotion", () => {
	test("moves a top-anchored photo at a share of the scroll distance", () => {
		const { el, frame, rect, listeners } = setup(0);
		attachScrollMotion(el, frame, "top", 0.35, 420);
		expect(el.style.transform).toBe("translate3d(0, 0.0px, 0)");

		rect.top = -300;
		listeners.get("scroll")?.();
		expect(el.style.transform).toBe("translate3d(0, 105.0px, 0)");
	});

	test("fades and lifts hero text over the fade distance", () => {
		const { el, frame, rect, listeners } = setup(0);
		attachScrollMotion(el, frame, "fade", 0.35, 400);
		rect.top = -200;
		listeners.get("scroll")?.();
		expect(el.style.opacity).toBe("0.5");
		expect(el.style.transform).toBe("translate3d(0, -30.0px, 0)");
	});

	test("drifts a framed photo around the viewport centre", () => {
		const { el, frame, rect, listeners } = setup(300, 600);
		attachScrollMotion(el, frame, "center", 0.1, 420);
		// Frame centre at 600 is 200px below the viewport centre (400).
		expect(el.style.transform).toBe("translate3d(0, -20.0px, 0)");

		rect.top = -100;
		listeners.get("scroll")?.();
		expect(el.style.transform).toBe("translate3d(0, 20.0px, 0)");
	});

	test("never pans a framed photo past its overshoot", () => {
		const { el, frame } = setup(3000, 600);
		attachScrollMotion(el, frame, "center", 0.5, 420);
		expect(el.style.transform).toBe("translate3d(0, -60.0px, 0)");
	});

	test("removes its listeners on cleanup", () => {
		const { el, frame, listeners } = setup(0);
		const cleanup = attachScrollMotion(el, frame, "top", 0.35, 420);
		expect(listeners.size).toBe(2);
		cleanup();
		expect(listeners.size).toBe(0);
	});
});
