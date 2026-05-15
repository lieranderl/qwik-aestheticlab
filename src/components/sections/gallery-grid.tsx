import { $, component$ } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
// Import images with vite-imagetools
import ImgEyebrows1 from "~/media/gallery/eyebrows1.jpg?jsx";
import ImgManicure1 from "~/media/gallery/manicure1.jpg?jsx";
import ImgManicure2 from "~/media/gallery/manicure2.jpg?jsx";
import ImgManicure3 from "~/media/gallery/manicure3.jpg?jsx";
import ImgManicure4 from "~/media/gallery/manicure4.jpg?jsx";
import ImgPedicure1 from "~/media/gallery/pedicure1.jpg?jsx";
import ImgPedicure2 from "~/media/gallery/pedicure2.jpg?jsx";
import ImgPedicure3 from "~/media/gallery/pedicure3.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";
import ImgWork2 from "~/media/gallery/work2.jpg?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();

	return (
		<section id="gallery" class="py-24">
			<div class="custom-container">
				<div class="mb-16 text-center">
					<FadeUp>
						<h2 class="font-qestero mb-4 text-4xl md:text-5xl">
							{t("app.work.title@@Our Work")}
						</h2>
						<div class="mx-auto h-px w-20 bg-primary" />
						<p class="font-montserrat mx-auto mt-6 max-w-2xl">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</p>
					</FadeUp>
				</div>

				{/* Static Gallery */}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
					{[
						{ Img: ImgManicure1, id: "m1" },
						{ Img: ImgPedicure5, id: "p5" },
						{ Img: ImgPedicure1, id: "p1" },
						{ Img: ImgManicure4, id: "m4" },
						{ Img: ImgManicure2, id: "m2" },
						{ Img: ImgPedicure2, id: "p2" },
						{ Img: ImgManicure3, id: "m3" },
						{ Img: ImgPedicure3, id: "p3" },
					].map(({ Img, id }, i) => (
						<FadeUp key={id} delay={i * 100} class="overflow-hidden rounded-xl">
							<Img
								alt="Aesthetic Lab Work"
								class="h-full w-full object-cover transition-transform duration-700 hover:scale-110 aspect-square"
							/>
						</FadeUp>
					))}
				</div>

				<FadeUp delay={400}>
					<a
						href="https://www.instagram.com/aestheticlabbe"
						target="_blank"
						rel="noreferrer"
						onClick$={$(() => {
							trackGoogleAnalyticsEvent("instagram_clicked", {
								placement: "gallery_section",
								target_type: "profile",
								link_url: "https://www.instagram.com/aestheticlabbe",
							});
						})}
						class="group mt-8 grid overflow-hidden rounded-[1.25rem] border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[2rem]"
					>
						<div class="flex flex-col justify-between gap-4 p-5 sm:p-6 md:p-8 lg:p-12">
							<div class="space-y-3 md:space-y-5">
								<div class="inline-flex items-center gap-2 text-primary">
									<SiInstagram class="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
									<p class="font-montserrat text-[0.65rem] uppercase tracking-[0.22em] md:text-xs md:tracking-[0.28em]">
										{t("app.instagram.eyebrow@@Instagram")}
									</p>
								</div>
								<h3 class="font-qestero max-w-48 text-[1.25rem] leading-[0.98] text-base-content sm:max-w-60 sm:text-[1.7rem] md:max-w-xl md:text-5xl">
									{t(
										"app.instagram.title@@Follow the studio beyond the appointment",
									)}
								</h3>
								<p class="font-montserrat max-w-sm text-[0.92rem] leading-relaxed text-base-content/75 md:max-w-lg md:text-base">
									{t(
										"app.instagram.description@@Fresh sets, quiet studio moments, and the details we keep returning to live on our Instagram profile.",
									)}
								</p>
							</div>

							<div class="flex flex-col items-start gap-2 md:gap-3">
								<span class="inline-flex items-center rounded-full border border-base-content/15 px-3 py-1.5 font-montserrat text-[0.72rem] tracking-[0.12em] text-base-content transition-colors group-hover:border-primary/30 group-hover:text-primary md:px-4 md:py-2 md:text-sm md:tracking-[0.18em]">
									@aestheticlabbe
								</span>
								<span class="font-montserrat text-[0.62rem] uppercase tracking-[0.16em] text-base-content/55 md:text-xs md:tracking-[0.24em]">
									{t("app.instagram.cta@@Open profile")}
								</span>
							</div>
						</div>

						<div class="grid h-[7.5rem] grid-cols-3 bg-base-200 sm:h-[9rem] lg:min-h-[20rem] lg:h-auto lg:grid-cols-[1.25fr_0.75fr]">
							<div class="overflow-hidden bg-base-100 lg:bg-transparent">
								<ImgWork2
									alt={t("app.instagram.alt.studio@@Aesthetic Lab studio work")}
									class="h-full w-full object-contain p-1 transition-transform duration-700 ease-out lg:object-cover lg:p-0 lg:group-hover:scale-105"
								/>
							</div>
							<div class="overflow-hidden border-l border-base-300 bg-base-100 lg:hidden">
								<ImgEyebrows1
									alt={t("app.instagram.alt.brows@@Aesthetic Lab brows detail")}
									class="h-full w-full object-contain p-1 transition-transform duration-700 ease-out"
								/>
							</div>
							<div class="overflow-hidden border-l border-base-300 bg-base-100 lg:hidden">
								<ImgManicure2
									alt={t(
										"app.instagram.alt.manicure@@Aesthetic Lab manicure detail",
									)}
									class="h-full w-full object-contain p-1 transition-transform duration-700 ease-out"
								/>
							</div>
							<div class="hidden grid-rows-2 gap-px bg-base-300 lg:grid">
								<div class="overflow-hidden">
									<ImgEyebrows1
										alt={t(
											"app.instagram.alt.brows@@Aesthetic Lab brows detail",
										)}
										class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								</div>
								<div class="overflow-hidden">
									<ImgManicure2
										alt={t(
											"app.instagram.alt.manicure@@Aesthetic Lab manicure detail",
										)}
										class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								</div>
							</div>
						</div>
					</a>
				</FadeUp>
			</div>
		</section>
	);
});
