import { component$, Slot } from "@qwik.dev/core";

/**
 * Section eyebrow/kicker label — a small uppercase label above section headings.
 * Replaces the duplicated pattern:
 *   <p class="mb-4 font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
 */
export const KickerLabel = component$(() => {
	return (
		<p class="mb-4 font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
			<Slot />
		</p>
	);
});
