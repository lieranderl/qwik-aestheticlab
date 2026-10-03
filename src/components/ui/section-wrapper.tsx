import { component$, Slot } from "@builder.io/qwik";

interface SectionWrapperProps {
	id: string;
	background?: "base-100" | "base-200" | "sage-50";
	/** Faint drifting Qestero wordmark behind the section heading. */
	watermark?: string;
}

const backgroundClassMap = {
	"base-100": "bg-base-100",
	"base-200": "bg-base-200",
	"sage-50": "bg-sage-50",
} as const;

export const SectionWrapper = component$<SectionWrapperProps>(
	({ id, background = "base-200", watermark }) => {
		const bgClass =
			backgroundClassMap[background] || backgroundClassMap["base-200"];
		return (
			<section
				id={id}
				class={[
					"scroll-mt-24 overflow-x-clip pb-16 md:pb-24 lg:pb-28",
					watermark ? "pt-6 md:pt-10" : "pt-16 md:pt-24 lg:pt-28",
					bgClass,
				]}
			>
				{watermark ? (
					<p
						aria-hidden="true"
						class="drift-word -mb-5 font-qestero text-[clamp(5rem,16vw,15rem)] leading-[0.82] whitespace-nowrap text-linen select-none md:-mb-[clamp(2.5rem,6vw,5.75rem)]"
					>
						{watermark}
					</p>
				) : null}
				<div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<Slot />
				</div>
			</section>
		);
	},
);
