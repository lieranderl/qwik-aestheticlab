import { component$, Slot } from "@builder.io/qwik";

interface SectionWrapperProps {
	id: string;
	background?: "base-100" | "base-200";
}

export const SectionWrapper = component$<SectionWrapperProps>(
	({ id, background = "base-200" }) => {
		return (
			<section
				id={id}
				class={`scroll-mt-24 overflow-hidden bg-${background} py-16 md:py-24 lg:py-28`}
			>
				<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<Slot />
				</div>
			</section>
		);
	},
);
