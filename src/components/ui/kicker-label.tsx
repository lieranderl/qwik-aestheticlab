import { component$, Slot } from "@builder.io/qwik";

interface KickerLabelProps {
	/** `sage` for labels on the sage brand surface, `photo` for labels over photography. */
	tone?: "default" | "sage" | "photo";
	class?: string;
}

const toneClasses = {
	default: { text: "text-sage-700", rule: "bg-sage-600" },
	sage: { text: "text-ink", rule: "bg-ink" },
	photo: { text: "text-neutral-content", rule: "bg-neutral-content" },
} as const;

/**
 * Editorial section eyebrow: a short rule followed by a small-caps label.
 */
export const KickerLabel = component$<KickerLabelProps>(
	({ tone = "default", class: className }) => {
		const classes = toneClasses[tone];
		return (
			<p
				class={[
					"mb-4 flex items-center gap-3 font-main text-[0.6875rem] font-semibold uppercase tracking-[0.28em] md:gap-3.5 md:text-xs",
					classes.text,
					className,
				]}
			>
				<span
					aria-hidden="true"
					class={["h-px w-7 shrink-0 md:w-10", classes.rule]}
				/>
				<Slot />
			</p>
		);
	},
);
