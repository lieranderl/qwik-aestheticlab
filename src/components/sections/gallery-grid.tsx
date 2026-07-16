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
		<section id="gallery" class="section-shell">
			<div class="custom-container">
				<div class="mb-10 text-center md:mb-16">
					<FadeUp>
						<h2 class="section-heading mb-4">
							{t("app.work.title@@Our Work")}
						</h2>
						<div class="mx-auto h-px w-20 bg-primary" />
						<p class="section-lead mx-auto mt-6 max-w-2xl">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</p>
					</FadeUp>
				</div>

				{/* Static Gallery */}
				<div class="mb-10 grid grid-cols-2 gap-3 md:mb-16 md:grid-cols-4 md:gap-4">
					{[
						{
							Img: ImgManicure1,
							id: "m1",
							altKey: "app.work.alt.m1@@Bespoke classic manicure detail",
						},
						{
							Img: ImgPedicure5,
							id: "p5",
							altKey: "app.work.alt.p5@@Aesthetic pedicure detailing",
						},
						{
							Img: ImgPedicure1,
							id: "p1",
							altKey: "app.work.alt.p1@@Nourishing foot bath and pedicure",
						},
						{
							Img: ImgManicure4,
							id: "m4",
							altKey:
								"app.work.alt.m4@@Precision cuticle work and natural gel nails",
						},
						{
							Img: ImgManicure2,
							id: "m2",
							altKey: "app.work.alt.m2@@Minimalist clean girl manicure styling",
						},
						{
							Img: ImgPedicure2,
							id: "p2",
							altKey: "app.work.alt.p2@@Refined toenail polish finish",
						},
						{
							Img: ImgManicure3,
							id: "m3",
							altKey: "app.work.alt.m3@@Elegant matte finish manicure",
						},
						{
							Img: ImgPedicure3,
							id: "p3",
							altKey:
								"app.work.alt.p3@@Professional hygienic pedicure treatment",
						},
					].map(({ Img, id, altKey }, i) => (
						<FadeUp key={id} delay={i * 40} class="overflow-hidden rounded-2xl">
							<Img
								alt={t(altKey)}
								class="interactive-media aspect-square h-full w-full object-cover"
								loading="lazy"
							/>
						</FadeUp>
					))}
				</div>

				<FadeUp delay={80}>
					<a
						data-testid="instagram-card"
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
						class="group surface-card mx-auto mt-8 grid w-full max-w-5xl overflow-hidden transition-shadow duration-200 hover:shadow-lg lg:h-112 lg:grid-cols-2"
					>
						<div class="flex min-h-0 flex-col justify-between gap-4 p-5 sm:p-6 md:p-8 lg:p-10">
							<div class="space-y-3 md:space-y-5">
								<div class="inline-flex items-center gap-2 text-primary">
									<SiInstagram
										class="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4"
										aria-hidden="true"
									/>
									<p class="font-montserrat text-xs uppercase tracking-[0.2em] md:tracking-[0.24em]">
										{t("app.instagram.eyebrow@@Instagram")}
									</p>
								</div>
								<h3 class="max-w-xl text-balance font-qestero text-3xl leading-none text-base-content md:text-4xl">
									{t(
										"app.instagram.title@@Follow the studio beyond the appointment",
									)}
								</h3>
								<p class="section-lead max-w-lg">
									{t(
										"app.instagram.description@@Fresh sets, quiet studio moments, and the details we keep returning to live on our Instagram profile.",
									)}
								</p>
							</div>

							<div class="flex flex-col items-start gap-2 md:gap-3">
								<span class="inline-flex items-center rounded-full border border-base-content/15 px-3 py-1.5 font-montserrat text-xs tracking-[0.12em] text-base-content transition-colors duration-150 group-hover:border-primary/30 group-hover:text-primary md:px-4 md:py-2 md:text-sm">
									@aestheticlabbe
								</span>
								<span class="font-montserrat text-xs uppercase tracking-[0.16em] text-base-content/65">
									{t("app.instagram.cta@@Open profile")}
								</span>
							</div>
						</div>

						<div class="grid h-48 grid-cols-3 overflow-hidden bg-base-200 sm:h-56 lg:h-full lg:min-h-0 lg:grid-cols-[1.25fr_0.75fr]">
							<div class="min-h-0 overflow-hidden bg-base-100 lg:bg-transparent">
								<ImgWork2
									alt={t("app.instagram.alt.studio@@Aesthetic Lab studio work")}
									class="interactive-media h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div class="overflow-hidden border-l border-base-300 bg-base-100 lg:hidden">
								<ImgEyebrows1
									alt={t("app.instagram.alt.brows@@Aesthetic Lab brows detail")}
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div class="overflow-hidden border-l border-base-300 bg-base-100 lg:hidden">
								<ImgManicure2
									alt={t(
										"app.instagram.alt.manicure@@Aesthetic Lab manicure detail",
									)}
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div class="hidden min-h-0 grid-rows-2 gap-px bg-base-300 lg:grid">
								<div class="min-h-0 overflow-hidden">
									<ImgEyebrows1
										alt={t(
											"app.instagram.alt.brows@@Aesthetic Lab brows detail",
										)}
										class="interactive-media h-full w-full object-cover"
										loading="lazy"
									/>
								</div>
								<div class="min-h-0 overflow-hidden">
									<ImgManicure2
										alt={t(
											"app.instagram.alt.manicure@@Aesthetic Lab manicure detail",
										)}
										class="interactive-media h-full w-full object-cover"
										loading="lazy"
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
