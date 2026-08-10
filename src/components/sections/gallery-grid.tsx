import { $, component$ } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import ImgChromeManicure from "~/media/gallery/atelier/chrome-manicure.jpg?jsx";
import ImgCoralManicure from "~/media/gallery/atelier/coral-manicure.jpg?jsx";
import ImgNudeManicure from "~/media/gallery/atelier/nude-manicure.jpg?jsx";
import ImgPearlManicure from "~/media/gallery/atelier/pearl-manicure.jpg?jsx";
import ImgPolishApplication from "~/media/gallery/atelier/polish-application.jpg?jsx";
import ImgPedicure4 from "~/media/gallery/pedicure4.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();
	const galleryItems = [
		{
			Img: ImgCoralManicure,
			id: "coral",
			alt: t(
				"app.work.alt.coral_manicure@@Bright coral-red manicure on both hands",
			),
			imageClass:
				"h-full w-full object-cover object-[center_34%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-4/5 w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-8 lg:w-auto lg:aspect-auto",
		},
		{
			Img: ImgPedicure4,
			id: "pink-pedicure",
			alt: t("app.work.alt.p2@@Refined toenail polish finish"),
			imageClass:
				"h-full w-full object-cover object-[center_58%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-square w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-6 lg:col-span-3 lg:row-start-2 lg:row-span-5 lg:w-auto lg:aspect-auto",
		},
		{
			Img: ImgNudeManicure,
			id: "nude",
			alt: t(
				"app.work.alt.nude_manicure@@Soft nude manicure with a clean glossy finish",
			),
			imageClass:
				"h-full w-full object-cover object-[center_48%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-square w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-6 lg:w-auto lg:aspect-auto",
		},
		{
			Img: ImgPearlManicure,
			id: "pearl",
			alt: t("app.work.alt.pearl_manicure@@Pearlescent pink manicure detail"),
			imageClass:
				"h-full w-full object-cover object-[center_52%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-square w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-6 lg:col-span-4 lg:row-start-8 lg:row-span-6 lg:w-auto lg:aspect-auto",
		},
		{
			Img: ImgChromeManicure,
			id: "chrome",
			alt: t("app.work.alt.chrome_manicure@@Pink chrome manicure detail"),
			imageClass:
				"h-full w-full object-cover object-[center_47%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-square w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-10 lg:col-span-3 lg:row-start-8 lg:row-span-5 lg:w-auto lg:aspect-auto",
		},
		{
			Img: ImgPedicure5,
			id: "rose-pedicure",
			alt: t("app.work.alt.p5@@Aesthetic pedicure detailing"),
			imageClass:
				"h-full w-full object-cover object-[center_40%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
			itemClass:
				"group relative carousel-item aspect-square w-[78%] shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:w-[58%] lg:col-start-1 lg:col-span-4 lg:row-start-10 lg:row-span-4 lg:w-auto lg:aspect-auto",
		},
	];

	return (
		<section
			id="gallery"
			class="scroll-mt-24 overflow-hidden bg-base-200 py-16 md:py-24 lg:py-28"
		>
			<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
					<div>
						<p class="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
							{t("app.work.kicker@@From our atelier")}
						</p>
						<h2 class="max-w-2xl text-balance font-qestero text-5xl leading-[0.9] text-base-content md:text-7xl lg:text-8xl">
							{t("app.work.title@@Our Work")}
						</h2>
					</div>
					<p class="max-w-md border-l border-base-300 pl-5 text-pretty font-montserrat text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base lg:justify-self-end">
						{t(
							"app.work.description@@Thoughtful details, clean finishes, and results that still feel like you.",
						)}
					</p>
				</div>

				<section
					class="carousel carousel-start -mx-4 mt-8 w-[calc(100%+2rem)] scroll-smooth snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:mt-10 sm:w-[calc(100%+3rem)] sm:px-6 lg:mx-0 lg:grid lg:h-[50rem] lg:w-full lg:grid-cols-12 lg:[grid-template-rows:repeat(14,minmax(0,1fr))] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
					aria-label={t("app.work.gallery_label@@Treatment result gallery")}
				>
					{galleryItems.map(
						({ Img, id, alt, imageClass, itemClass }, index) => (
							<figure key={id} class={itemClass}>
								<Img
									alt={alt}
									class={imageClass}
									loading="lazy"
									sizes="(min-width: 1280px) 38rem, (min-width: 1024px) calc(33vw - 1rem), 78vw"
								/>
								<figcaption class="absolute right-3 bottom-3 rounded-field bg-base-100/90 px-2 py-1 font-montserrat text-[0.6rem] font-semibold tracking-[0.16em] text-base-content shadow-sm">
									{String(index + 1).padStart(2, "0")}
								</figcaption>
							</figure>
						),
					)}
				</section>

				<a
					data-testid="instagram-card"
					href="https://www.instagram.com/aestheticlabbe"
					target="_blank"
					rel="noopener noreferrer"
					onClick$={$(() => {
						trackGoogleAnalyticsEvent("instagram_clicked", {
							placement: "gallery_section",
							target_type: "profile",
							link_url: "https://www.instagram.com/aestheticlabbe",
						});
					})}
					class="group card card-border relative z-10 mx-auto mt-10 max-w-5xl overflow-hidden bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg sm:card-side sm:mt-14 sm:h-72 lg:mt-20 lg:mr-8"
				>
					<figure class="h-44 bg-base-300 sm:h-full sm:w-2/5">
						<ImgPolishApplication
							alt={t(
								"app.work.alt.manicure_process@@Manicure polish application in the Aesthetic Lab studio",
							)}
							class="h-full w-full object-cover object-[center_63%] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
							loading="lazy"
							sizes="(min-width: 1024px) 24rem, (min-width: 640px) 40vw, 100vw"
						/>
					</figure>
					<div class="card-body min-w-0 justify-center gap-4 p-5 sm:p-7 md:gap-5 md:p-9">
						<div class="flex items-center gap-2 text-secondary">
							<SiInstagram class="size-4" aria-hidden="true" />
							<span class="font-montserrat text-xs font-semibold uppercase tracking-[0.18em]">
								instagram
							</span>
						</div>
						<h3 class="card-title text-3xl font-normal leading-none md:text-4xl">
							{t(
								"app.instagram.title@@Follow the studio beyond the appointment",
							)}
						</h3>
						<p class="font-montserrat text-sm leading-relaxed text-base-content">
							{t(
								"app.instagram.description@@Fresh sets, studio moments, and new work from our team.",
							)}
						</p>
						<div class="card-actions mt-1">
							<span class="btn btn-sm min-h-11 px-4 font-montserrat text-xs font-semibold uppercase tracking-[0.1em]">
								@aestheticlabbe
							</span>
						</div>
					</div>
				</a>
			</div>
		</section>
	);
});
