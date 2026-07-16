import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import ImgManicure5 from "~/media/gallery/manicure5.jpg?jsx";
import ImgWork1 from "~/media/gallery/work1.jpg?jsx";

export const AboutSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section
			id="about"
			class="section-shell relative overflow-hidden bg-base-200/35"
		>
			{/* Background Decor - Watermark & Blobs */}
			<div
				aria-hidden="true"
				class="pointer-events-none absolute top-4 left-0 z-0 hidden w-full select-none text-center font-qestero text-[10vw] leading-none text-primary/20 sm:block md:top-10 md:left-10 md:w-auto md:text-left md:text-[8vw] md:text-primary/35"
			>
				Aesthetic Lab
			</div>
			<div class="custom-container relative z-10">
				<div class="flex flex-col items-center gap-12 md:gap-16 lg:flex-row">
					{/* Left Column: Narrative Text */}
					<div class="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
						<FadeUp>
							<div class="mb-6 flex items-center justify-center gap-4 lg:justify-start">
								<span class="h-px w-12 bg-primary"></span>
								<span class="editorial-kicker">
									{t("app.about.subtitle@@Since 2025")}
								</span>
							</div>
							<h2 class="section-heading mb-6 md:mb-8">
								{t("app.story@@Our Story")} <br />
								<span class="mt-2 block text-3xl italic text-secondary md:text-4xl">
									{t("app.about.philosophy@@& Philosophy")}
								</span>
							</h2>
						</FadeUp>

						<FadeUp delay={80}>
							<div class="section-lead relative max-w-2xl text-pretty">
								{/* Decorative Quote Mark */}
								<span
									aria-hidden="true"
									class="absolute -top-8 -left-8 hidden font-serif text-8xl leading-none text-primary/10 lg:block"
								>
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
					<div class="relative flex min-h-80 w-full items-center justify-center md:min-h-128 lg:w-1/2 lg:justify-end">
						<FadeUp delay={120} direction="left" class="relative z-10">
							<div class="relative aspect-3/4 w-56 overflow-hidden rounded-2xl border border-base-content/10 shadow-lg md:w-80 lg:w-96">
								<ImgWork1
									alt={t(
										"app.about.alt.artists@@Aesthetic Lab artists at work in Leuven studio",
									)}
									class="interactive-media h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
						</FadeUp>

						{/* Overlapping Detail Shot */}
						<FadeUp
							delay={160}
							direction="up"
							class="absolute bottom-0 left-6 z-20 md:-bottom-10 md:left-20 lg:-left-10"
						>
							<div>
								<div class="aspect-square w-32 overflow-hidden rounded-2xl border-2 border-base-100 shadow-lg md:w-52">
									<ImgManicure5
										alt={t(
											"app.about.alt.manicure_detail@@Close-up detail of premium gel manicure work",
										)}
										class="object-cover w-full h-full"
										loading="lazy"
									/>
								</div>
							</div>
						</FadeUp>

						{/* Decorative Elements around images */}
						<div class="pointer-events-none absolute top-10 right-10 size-24 rounded-tr-2xl border-t-2 border-r-2 border-primary/30" />
					</div>
				</div>
			</div>
		</section>
	);
});
