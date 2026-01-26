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
			{/* Background Decor - Watermark & Blobs */}
			<div class="absolute top-10 left-10 text-[12vw] md:text-[8vw] font-qestero leading-none text-base-200/40 select-none pointer-events-none z-0">
				Aesthetic Lab
			</div>
			<div class="absolute -right-20 top-40 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[100px] animate-pulse-slow" />

			<div class="custom-container relative z-10">
				<div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
					{/* Left Column: Narrative Text */}
					<div class="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
						<FadeUp>
							<div class="flex items-center gap-4 mb-6 justify-center lg:justify-start">
								<span class="h-px w-12 bg-primary"></span>
								<span class="text-xs font-bold tracking-[0.2em] text-primary uppercase">
									{t("app.about.subtitle@@Since 2025")}
								</span>
							</div>
							<h2 class="font-qestero text-5xl md:text-6xl lg:text-7xl mb-8 leading-[0.9]">
								{t("app.story@@Our Story")} <br />
								<span class="italic text-secondary text-4xl md:text-5xl lg:text-6xl block mt-2">
									{t("app.about.philosophy@@& Philosophy")}
								</span>
							</h2>
						</FadeUp>

						<FadeUp delay={200}>
							<div class="prose prose-lg text-neutral-content font-montserrat leading-relaxed relative">
								{/* Decorative Quote Mark */}
								<span class="absolute -top-8 -left-8 text-8xl text-primary/10 font-serif leading-none hidden lg:block">
									“
								</span>

								<p class="mb-6">
									{t(
										"app.story_text@@At Aesthetic Lab, we believe in the transformative power of beauty. Our approach combines artistry with expertise, creating a sanctuary where you can discover your most radiant self.",
									)}
								</p>
								<p>
									{t(
										"app.about.extra_text@@We are dedicated to providing the highest quality treatments in a relaxing environment. Every detail is curated to ensure your comfort and satisfaction, making your visit a truly rejuvenating experience.",
									)}
								</p>
							</div>
						</FadeUp>
					</div>

					{/* Right Column: Photo Cluster */}
					<div class="lg:w-1/2 relative min-h-[500px] w-full flex items-center justify-center lg:justify-end">
						<FadeUp
							delay={300}
							duration={1200}
							direction="left"
							class="relative z-10"
						>
							<div class="w-72 md:w-80 lg:w-96 aspect-3/4 overflow-hidden rounded-t-[10rem] rounded-b-3xl border border-white/50 shadow-2xl relative">
								<img
									src="/media/gallery/work1.jpg"
									alt="Artists at Work"
									width="400"
									height="600"
									class="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
								/>
							</div>
						</FadeUp>

						{/* Overlapping Detail Shot */}
						<FadeUp
							delay={500}
							duration={1200}
							direction="up"
							class="absolute -bottom-10 left-4 md:left-20 lg:-left-10 z-20"
						>
							<div class="animate-float">
								<div class="w-48 md:w-56 aspect-square rounded-full border-4 border-white shadow-xl overflow-hidden">
									<img
										src="/media/gallery/manicure5.jpg"
										alt="Detail Shot"
										width="300"
										height="300"
										class="object-cover w-full h-full"
									/>
								</div>
							</div>
						</FadeUp>

						{/* Decorative Elements around images */}
						<div class="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl pointer-events-none" />
						<div class="absolute -bottom-5 left-10 lg:-left-14 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-10" />
					</div>
				</div>
			</div>
		</section>
	);
});
