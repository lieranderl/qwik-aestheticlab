import { $, component$, useSignal } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import {
	GalleryLightbox,
	galleryLightboxCloseId,
	galleryLightboxId,
} from "~/components/ui/gallery-lightbox";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SectionWrapper } from "~/components/ui/section-wrapper";
import ImgChromeManicure from "~/media/gallery/atelier/chrome-manicure.jpg?jsx";
import ImgCoralManicure from "~/media/gallery/atelier/coral-manicure.jpg?jsx";
import ImgLashes from "~/media/gallery/atelier/lashes.jpg?jsx";
import ImgLashlift from "~/media/gallery/atelier/lashlift.jpg?jsx";
import ImgNudeManicure from "~/media/gallery/atelier/nude-manicure.jpg?jsx";
import ImgPearlManicure from "~/media/gallery/atelier/pearl-manicure.jpg?jsx";
import ImgPolishApplication from "~/media/gallery/atelier/polish-application.jpg?jsx";
import ImgPedicure4 from "~/media/gallery/pedicure4.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

const GRID_ITEM =
	"group relative carousel-item shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg w-[78%] sm:w-[58%] lg:w-auto lg:aspect-auto";
const GRID_IMG =
	"h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none";
const CAPTION =
	"pointer-events-none absolute right-3 bottom-3 rounded-field bg-base-100/90 px-2 py-1 font-main text-[0.6rem] font-semibold tracking-[0.16em] text-base-content shadow-sm";
const SIZES =
	"(min-width: 1280px) 38rem, (min-width: 1024px) calc(33vw - 1rem), 78vw";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();
	const activeIndex = useSignal(-1);
	const openerId = useSignal("");
	const items = [
		{
			Image: ImgCoralManicure,
			alt: t(
				"app.work.alt.coral_manicure@@Bright coral-red manicure on both hands",
			),
			class:
				"aspect-4/5 lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-8",
			imageClass: "object-[center_34%]",
		},
		{
			Image: ImgPedicure4,
			alt: t("app.work.alt.p2@@Refined toenail polish finish"),
			class:
				"aspect-square lg:col-start-6 lg:col-span-3 lg:row-start-2 lg:row-span-5",
			imageClass: "object-[center_58%]",
		},
		{
			Image: ImgNudeManicure,
			alt: t(
				"app.work.alt.nude_manicure@@Soft nude manicure with a clean glossy finish",
			),
			class:
				"aspect-square lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-6",
			imageClass: "object-[center_48%]",
		},
		{
			Image: ImgPearlManicure,
			alt: t("app.work.alt.pearl_manicure@@Pearlescent pink manicure detail"),
			class:
				"aspect-square lg:col-start-6 lg:col-span-4 lg:row-start-8 lg:row-span-6",
			imageClass: "object-[center_52%]",
		},
		{
			Image: ImgChromeManicure,
			alt: t("app.work.alt.chrome_manicure@@Pink chrome manicure detail"),
			class:
				"aspect-square lg:col-start-10 lg:col-span-3 lg:row-start-8 lg:row-span-5",
			imageClass: "object-[center_47%]",
		},
		{
			Image: ImgPedicure5,
			alt: t("app.work.alt.p5@@Aesthetic pedicure detailing"),
			class:
				"aspect-square lg:col-start-1 lg:col-span-4 lg:row-start-10 lg:row-span-5",
			imageClass: "object-[center_40%]",
		},
		{
			Image: ImgLashes,
			alt: t("app.work.alt.lashes@@Lash extensions result"),
			class:
				"aspect-square lg:col-start-5 lg:col-span-4 lg:row-start-14 lg:row-span-4",
			imageClass: "object-[center_40%]",
		},
		{
			Image: ImgLashlift,
			alt: t("app.work.alt.lashlift@@Lash lift result"),
			class:
				"aspect-square lg:col-start-1 lg:col-span-4 lg:row-start-15 lg:row-span-4",
			imageClass: "object-[center_50%]",
		},
	];

	const open = $((_event: MouseEvent, element: HTMLButtonElement) => {
		const index = Number(element.dataset.galleryIndex);
		if (!Number.isInteger(index)) return;
		activeIndex.value = index;
		openerId.value = element.id;
		requestAnimationFrame(() => {
			const dialog = document.getElementById(
				galleryLightboxId,
			) as HTMLDialogElement;
			if (!dialog) return;
			dialog.showModal();
			requestAnimationFrame(() => {
				document.getElementById(galleryLightboxCloseId)?.focus();
			});
		});
	});

	return (
		<SectionWrapper id="gallery">
			<div class="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
				<div>
					<KickerLabel>{t("app.work.kicker@@From our atelier")}</KickerLabel>
					<h2 class="max-w-2xl text-balance font-cormorant text-5xl leading-[0.9] text-base-content md:text-7xl lg:text-8xl">
						{t("app.work.title@@Our Work")}
					</h2>
				</div>
				<p class="max-w-md border-l border-base-300 pl-5 text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base lg:justify-self-end">
					{t(
						"app.work.description@@Thoughtful details, clean finishes, and results that still feel like you.",
					)}
				</p>
			</div>

			<section
				class="carousel carousel-start -mx-4 mt-8 w-[calc(100%+2rem)] scroll-smooth snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:mt-10 sm:w-[calc(100%+3rem)] sm:px-6 lg:mx-0 lg:grid lg:h-240 lg:w-full lg:grid-cols-12 lg:grid-rows-18 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
				aria-label={t("app.work.gallery_label@@Treatment result gallery")}
			>
				{items.map((item, index) => {
					const triggerId = `gallery-lightbox-trigger-${index}`;
					const Image = item.Image;
					return (
						<figure key={item.alt} class={[GRID_ITEM, item.class]}>
							<button
								id={triggerId}
								data-gallery-index={index}
								type="button"
								class="block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-base-content"
								onClick$={open}
								aria-label={t("app.work.enlarge@@Enlarge image")}
							>
								<Image
									alt={item.alt}
									class={[GRID_IMG, item.imageClass]}
									loading="lazy"
									sizes={SIZES}
								/>
							</button>
							<figcaption class={CAPTION}>
								{String(index + 1).padStart(2, "0")}
							</figcaption>
						</figure>
					);
				})}
			</section>

			<GalleryLightbox activeIndex={activeIndex} openerId={openerId} />

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
				<div class="card-body min-w-0 justify-center gap-4 bg-base-100 p-5 shadow-sm sm:w-96 sm:p-7 md:gap-5 md:p-9">
					<div class="flex items-center gap-2 text-secondary">
						<SiInstagram class="size-4" aria-hidden="true" />
						<span class="font-main text-xs font-semibold uppercase tracking-[0.18em]">
							Instagram
						</span>
					</div>
					<h3 class="card-title text-3xl leading-none font-normal md:text-4xl">
						{t("app.instagram.title@@Follow the studio beyond the appointment")}
					</h3>
					<p class="font-main text-sm leading-relaxed text-base-content">
						{t(
							"app.instagram.description@@Fresh sets, studio moments, and new work from our team.",
						)}
					</p>
					<div class="card-actions mt-1">
						<span class="btn btn-sm min-h-11 px-4 font-main text-xs font-semibold uppercase tracking-widest">
							@aestheticlabbe
						</span>
					</div>
				</div>
			</a>
		</SectionWrapper>
	);
});
