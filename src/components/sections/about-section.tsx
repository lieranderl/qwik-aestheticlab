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
			class="relative scroll-mt-24 overflow-hidden py-16 md:py-32"
		>
			{/* Background Decor - Watermark & Blobs */}
			<div class="pointer-events-none absolute top-4 left-0 z-0 hidden w-full select-none text-center font-qestero text-[10vw] leading-none text-primary/20 sm:block md:top-10 md:left-10 md:w-auto md:text-left md:text-[8vw] md:text-primary/35">
				Aesthetic Lab
			</div>
			<div class="absolute -right-20 top-40 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[100px] animate-pulse-slow" />

			<div class="custom-container relative z-10">
				<div class="flex flex-col items-center gap-10 md:gap-16 lg:flex-row lg:gap-24">
					{/* Left Column: Narrative Text */}
					<div class="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
						<FadeUp>
							<div class="flex items-center gap-4 mb-6 justify-center lg:justify-start">
								<span class="h-px w-12 bg-primary"></span>
								<span class="text-xs font-bold tracking-[0.2em] text-primary uppercase">
									{t("app.about.subtitle@@Since 2025")}
								</span>
							</div>
							<h2 class="font-qestero mb-6 text-4xl leading-[0.9] md:mb-8 md:text-6xl lg:text-7xl">
								{t("app.story@@Our Story")} <br />
								<span class="mt-2 block text-3xl italic text-secondary md:text-5xl lg:text-6xl">
									{t("app.about.philosophy@@& Philosophy")}
								</span>
							</h2>
						</FadeUp>

						<FadeUp delay={200}>
							<div class="prose prose-sm relative font-montserrat leading-relaxed text-base-content md:prose-lg">
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
					<div class="relative flex min-h-[320px] w-full items-center justify-center md:min-h-[500px] lg:w-1/2 lg:justify-end">
						<FadeUp
							delay={300}
							duration={1200}
							direction="left"
							class="relative z-10"
						>
							<div class="relative aspect-3/4 w-56 overflow-hidden rounded-t-[10rem] rounded-b-3xl border border-white/50 shadow-2xl md:w-80 lg:w-96">
								<ImgWork1
									alt="Artists at Work"
									class="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
									loading="lazy"
								/>
							</div>
						</FadeUp>

						{/* Overlapping Detail Shot */}
						<FadeUp
							delay={500}
							duration={1200}
							direction="up"
							class="absolute bottom-0 left-6 z-20 md:-bottom-10 md:left-20 lg:-left-10"
						>
							<div class="animate-float">
								<div class="aspect-square w-32 overflow-hidden rounded-full border-4 border-white shadow-xl md:w-56">
									<ImgManicure5
										alt="Detail Shot"
										class="object-cover w-full h-full"
										loading="lazy"
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
