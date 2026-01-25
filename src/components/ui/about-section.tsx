import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";

export const AboutSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section
			id="about"
			class="relative py-32 bg-white text-base-content overflow-hidden"
		>
			{/* Soft backdrop element */}
			<div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-base-100 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

			<div class="custom-container">
				<div class="flex flex-col items-center text-center max-w-4xl mx-auto">
					<FadeUp>
						<h2 class="font-qestero text-4xl md:text-5xl mb-10 leading-tight">
							{t("app.story@@Our Story")}
						</h2>
					</FadeUp>

					<FadeUp delay={200}>
						<p class="font-montserrat text-lg md:text-xl text-neutral-content leading-relaxed max-w-2xl">
							{t(
								"app.story_text@@At Aesthetic Lab, we believe in the transformative power of beauty. Our approach combines artistry with expertise, creating a sanctuary where you can discover your most radiant self.",
							)}
						</p>
					</FadeUp>

					{/* Decorative line */}
					<FadeUp delay={400}>
						<div class="h-16 w-px bg-primary/50 mt-12" />
					</FadeUp>
				</div>
			</div>
		</section>
	);
});
