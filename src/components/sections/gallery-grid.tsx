import { $, component$, useSignal } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import {
	GalleryLightbox,
	galleryLightboxCloseId,
	galleryLightboxId,
} from "~/components/ui/gallery-lightbox";
import { InViewVideo, VideoControl } from "~/components/ui/in-view-video";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SectionWrapper } from "~/components/ui/section-wrapper";
import { SITE_METADATA } from "~/constants/metadata";
import ImgChromeManicure from "~/media/gallery/atelier/chrome-manicure.jpg?jsx";
import ImgCherryGloss from "~/media/gallery/cherry-gloss.jpg?jsx";
import ImgLashLiftProcess from "~/media/gallery/lash-lift-process.jpg?jsx";
import ImgLashLiftResult from "~/media/gallery/lash-lift-result.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";
import ImgPinkShimmer from "~/media/gallery/pink-shimmer.jpg?jsx";
import ImgTortoise from "~/media/gallery/tortoise.jpg?jsx";
import ImgWhiteShimmer from "~/media/gallery/white-shimmer.jpg?jsx";
import catEyeVideo from "~/media/video/cateye.mp4?url";
import catEyePoster from "~/media/video/cateye-poster.jpg?url";
import chromeVideo from "~/media/video/chrome.mp4?url";
import chromePoster from "~/media/video/chrome-poster.jpg?url";
import nudeVideo from "~/media/video/nude.mp4?url";
import nudePoster from "~/media/video/nude-poster.jpg?url";
import resetVideo from "~/media/video/reset.mp4?url";
import resetPoster from "~/media/video/reset-poster.jpg?url";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

const SMALL_SIZES = "(min-width: 1280px) 19rem, (min-width: 768px) 25vw, 50vw";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();
	const activeIndex = useSignal(-1);
	const openerId = useSignal("");
	// Order matches the lightbox. Magazine grid: one large tile, one wide tile.
	const items = [
		{
			Image: ImgPinkShimmer,
			alt: t(
				"app.work.alt.pink_shimmer@@Pink shimmer gel manicure resting on a mohair knit",
			),
			class: "col-span-2 h-60 sm:h-80 md:row-span-2",
			imageClass: "object-[center_45%]",
			sizes: "(min-width: 1280px) 38rem, (min-width: 768px) 50vw, 100vw",
		},
		{
			Image: ImgChromeManicure,
			alt: t("app.work.alt.chrome_manicure@@Pink chrome manicure detail"),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_47%]",
		},
		{
			Image: ImgCherryGloss,
			alt: t("app.work.alt.cherry_gloss@@Glossy dark cherry manicure"),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_50%]",
		},
		{
			Image: ImgLashLiftResult,
			alt: t(
				"app.work.alt.lash_lift_result@@Lifted, curled lashes after a lash lift",
			),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_70%]",
		},
		{
			Image: ImgTortoise,
			alt: t("app.work.alt.tortoise@@Brown and tortoiseshell gel manicure"),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_60%]",
		},
		{
			Image: ImgWhiteShimmer,
			alt: t("app.work.alt.white_shimmer@@White shimmer gel manicure"),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_45%]",
		},
		{
			Image: ImgLashLiftProcess,
			alt: t(
				"app.work.alt.lash_lift_process@@Lash lift in progress, lashes set on a silicone shield",
			),
			class: "h-35 sm:h-56",
			imageClass: "object-[center_55%]",
		},
		{
			Image: ImgPedicure5,
			alt: t("app.work.alt.p5@@Aesthetic pedicure detailing"),
			class: "col-span-2 h-35 sm:h-56",
			imageClass: "object-[center_40%]",
			sizes: "(min-width: 1280px) 38rem, (min-width: 768px) 50vw, 100vw",
		},
	];

	// Short studio clips from Instagram; each plays once when it scrolls into view.
	const clips = [
		{
			src: chromeVideo,
			poster: chromePoster,
			tag: t("app.work.clip.chrome@@Chrome"),
			label: t(
				"app.work.clip.chrome_label@@Chrome powder buffed onto a lavender gel nail",
			),
		},
		{
			src: catEyeVideo,
			poster: catEyePoster,
			tag: t("app.work.clip.cat_eye@@Cat eye"),
			label: t(
				"app.work.clip.cat_eye_label@@Cat-eye gel polish shimmering under a magnet",
			),
		},
		{
			src: nudeVideo,
			poster: nudePoster,
			tag: t("app.work.clip.soft_pink@@Soft pink"),
			label: t(
				"app.work.clip.soft_pink_label@@A finished soft pink gel manicure",
			),
		},
		{
			src: resetVideo,
			poster: resetPoster,
			tag: t("app.work.clip.foam@@Foam wash"),
			label: t(
				"app.work.clip.foam_label@@Pink gel manicure being washed with soft foam",
			),
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

	const trackInstagram = $(() => {
		trackGoogleAnalyticsEvent("instagram_clicked", {
			placement: "gallery_section",
			target_type: "profile",
			link_url: SITE_METADATA.socials.instagram,
		});
	});

	return (
		<SectionWrapper id="gallery" background="base-100">
			<div class="mb-4.5 grid gap-6 md:mb-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-16">
				<FadeUp>
					<KickerLabel>{t("app.work.kicker@@Our work")}</KickerLabel>
					<h2 class="text-balance font-cormorant text-[2.875rem] leading-[0.95] text-base-content md:text-7xl lg:text-[5.5rem] lg:leading-[0.9]">
						{t("app.work.heading@@Recent work")}
					</h2>
				</FadeUp>
				<div class="hidden flex-col gap-4.5 lg:flex">
					<p class="font-cormorant text-[1.375rem] leading-snug text-base-content italic">
						{t(
							"app.work.instagram_note@@Fresh sets and studio moments. More every week on Instagram.",
						)}
					</p>
					<a
						href={SITE_METADATA.socials.instagram}
						target="_blank"
						rel="noopener noreferrer"
						onClick$={trackInstagram}
						class="btn btn-outline h-13 min-h-13 gap-2.5 self-start border-neutral px-6 font-main text-sm font-semibold"
					>
						<SiInstagram class="size-4.5" aria-hidden="true" />
						@aestheticlabbe
					</a>
				</div>
			</div>

			<ul
				class="grid grid-cols-2 gap-2 md:h-[min(46rem,72vw)] md:grid-cols-4 md:grid-rows-3 md:gap-4"
				aria-label={t("app.work.gallery_label@@Treatment result gallery")}
			>
				{items.map((item, index) => {
					const triggerId = `gallery-lightbox-trigger-${index}`;
					const Image = item.Image;
					return (
						<li
							key={item.alt}
							class={[
								"group overflow-hidden bg-base-300 md:h-auto",
								item.class,
							]}
						>
							<button
								id={triggerId}
								data-gallery-index={index}
								type="button"
								class="block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-3 focus-visible:outline-base-content"
								onClick$={open}
								aria-label={t("app.work.enlarge@@Enlarge image")}
							>
								<Image
									alt={item.alt}
									class={["h-full w-full object-cover", item.imageClass]}
									loading="lazy"
									sizes={item.sizes ?? SMALL_SIZES}
								/>
							</button>
						</li>
					);
				})}
			</ul>

			<ul
				class="-mx-4 mt-2 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 md:overflow-visible md:px-0"
				aria-label={t("app.work.clips_label@@Studio clips")}
			>
				{clips.map((clip, index) => (
					<li
						key={clip.src}
						class="relative h-96 w-[62vw] max-w-64 shrink-0 snap-start overflow-hidden bg-sage-200 md:h-[34rem] md:w-auto md:max-w-none"
					>
						<InViewVideo
							id={`work-clip-${index}`}
							src={clip.src}
							poster={clip.poster}
							label={clip.label}
							class="h-full w-full object-cover"
						/>
						<span class="absolute bottom-3.5 left-3.5 bg-linen/92 px-3 py-1.5 font-main text-xs font-semibold tracking-[0.1em] text-ink uppercase">
							{clip.tag}
						</span>
						<VideoControl
							videoId={`work-clip-${index}`}
							name={clip.tag}
							class="absolute right-3.5 bottom-3.5"
						/>
					</li>
				))}
			</ul>

			<GalleryLightbox activeIndex={activeIndex} openerId={openerId} />

			<a
				data-testid="instagram-link"
				href={SITE_METADATA.socials.instagram}
				target="_blank"
				rel="noopener noreferrer"
				onClick$={trackInstagram}
				class="btn btn-outline mt-4.5 h-13 min-h-13 w-full justify-between border-neutral px-4.5 font-main text-[0.9375rem] font-semibold lg:hidden"
			>
				{t("app.work.more_on_instagram@@More on Instagram")} · @aestheticlabbe
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.4"
					class="size-4.5"
					aria-hidden="true"
				>
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</a>
		</SectionWrapper>
	);
});
