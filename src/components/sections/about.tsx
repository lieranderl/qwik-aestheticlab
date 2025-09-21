import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export default component$(() => {
	const t = inlineTranslate();
	return (
		<section id="about" class="py-20 bg-base-200">
			<div class="custom-container">
				<div class="max-w-3xl mx-auto text-center">
					<h2 class="text-4xl font-qestero mb-8 font-bold">
						{t("app.story@@Our Story")}
					</h2>
					<p class="text-lg mb-8 leading-relaxed" data-aos="fade-up">
						{t(
							"app.story_text@@At Aesthetic Lab, we believe in the transformative power of beauty. Our approach combines artistry with expertise, creating a sanctuary where you can discover your most radiant self.",
						)}
					</p>
				</div>
			</div>
		</section>
	);
});
