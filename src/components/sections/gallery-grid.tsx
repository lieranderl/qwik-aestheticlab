import { $, component$, useSignal } from "@builder.io/qwik";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
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

/* ── Shared classes to keep the file DRY ── */
const GRID_ITEM =
	"group relative carousel-item shrink-0 snap-start overflow-hidden rounded-box bg-base-200 transition-shadow duration-200 motion-safe:hover:shadow-lg w-[78%] sm:w-[58%] lg:w-auto lg:aspect-auto";
const GRID_IMG =
	"h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none";
const LIGHTBOX_IMG = "max-h-[85vh] max-w-[90vw] rounded-box object-contain";
const CAPTION =
	"pointer-events-none absolute right-3 bottom-3 rounded-field bg-base-100/90 px-2 py-1 font-main text-[0.6rem] font-semibold tracking-[0.16em] text-base-content shadow-sm";
const ENLARGE = "app.work.enlarge@@Enlarge image";
const SIZES =
	"(min-width: 1280px) 38rem, (min-width: 1024px) calc(33vw - 1rem), 78vw";

const LIGHTBOX_IMAGES = [
	ImgCoralManicure,
	ImgPedicure4,
	ImgNudeManicure,
	ImgPearlManicure,
	ImgChromeManicure,
	ImgPedicure5,
	ImgLashes,
	ImgLashlift,
] as const;

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();
	const activeIndex = useSignal(-1);
	const COUNT = LIGHTBOX_IMAGES.length;

	const open = $((n: number) => {
		activeIndex.value = n;
	});
	const close = $(() => {
		activeIndex.value = -1;
	});
	const prev = $(() => {
		activeIndex.value = (activeIndex.value - 1 + COUNT) % COUNT;
	});
	const next = $(() => {
		activeIndex.value = (activeIndex.value + 1) % COUNT;
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
				class="carousel carousel-start -mx-4 mt-8 w-[calc(100%+2rem)] scroll-smooth snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:mt-10 sm:w-[calc(100%+3rem)] sm:px-6 lg:mx-0 lg:grid lg:h-[60rem] lg:w-full lg:grid-cols-12 lg:[grid-template-rows:repeat(18,minmax(0,1fr))] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
				aria-label={t("app.work.gallery_label@@Treatment result gallery")}
			>
				{/* 01 - Coral */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-4/5 lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-8",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(0)}
						aria-label={t(ENLARGE)}
					>
						<ImgCoralManicure
							alt={t(
								"app.work.alt.coral_manicure@@Bright coral-red manicure on both hands",
							)}
							class={[GRID_IMG, "object-[center_34%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>01</figcaption>
				</figure>

				{/* 02 - Pedicure 4 */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-6 lg:col-span-3 lg:row-start-2 lg:row-span-5",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(1)}
						aria-label={t(ENLARGE)}
					>
						<ImgPedicure4
							alt={t("app.work.alt.p2@@Refined toenail polish finish")}
							class={[GRID_IMG, "object-[center_58%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>02</figcaption>
				</figure>

				{/* 03 - Nude */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-6",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(2)}
						aria-label={t(ENLARGE)}
					>
						<ImgNudeManicure
							alt={t(
								"app.work.alt.nude_manicure@@Soft nude manicure with a clean glossy finish",
							)}
							class={[GRID_IMG, "object-[center_48%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>03</figcaption>
				</figure>

				{/* 04 - Pearl */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-6 lg:col-span-4 lg:row-start-8 lg:row-span-6",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(3)}
						aria-label={t(ENLARGE)}
					>
						<ImgPearlManicure
							alt={t(
								"app.work.alt.pearl_manicure@@Pearlescent pink manicure detail",
							)}
							class={[GRID_IMG, "object-[center_52%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>04</figcaption>
				</figure>

				{/* 05 - Chrome */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-10 lg:col-span-3 lg:row-start-8 lg:row-span-5",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(4)}
						aria-label={t(ENLARGE)}
					>
						<ImgChromeManicure
							alt={t(
								"app.work.alt.chrome_manicure@@Pink chrome manicure detail",
							)}
							class={[GRID_IMG, "object-[center_47%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>05</figcaption>
				</figure>

				{/* 06 - Pedicure 5 */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-1 lg:col-span-4 lg:row-start-10 lg:row-span-5",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(5)}
						aria-label={t(ENLARGE)}
					>
						<ImgPedicure5
							alt={t("app.work.alt.p5@@Aesthetic pedicure detailing")}
							class={[GRID_IMG, "object-[center_40%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>06</figcaption>
				</figure>

				{/* 07 - Lashes */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-5 lg:col-span-4 lg:row-start-14 lg:row-span-4",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(6)}
						aria-label={t(ENLARGE)}
					>
						<ImgLashes
							alt={t("app.work.alt.lashes@@Lash extensions result")}
							class={[GRID_IMG, "object-[center_40%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>07</figcaption>
				</figure>

				{/* 08 - Lash Lift */}
				<figure
					class={[
						GRID_ITEM,
						"aspect-square lg:col-start-1 lg:col-span-4 lg:row-start-15 lg:row-span-4",
					]}
				>
					<button
						type="button"
						class="contents cursor-zoom-in"
						onClick$={() => open(7)}
						aria-label={t(ENLARGE)}
					>
						<ImgLashlift
							alt={t("app.work.alt.lashlift@@Lash lift result")}
							class={[GRID_IMG, "object-[center_50%]"]}
							loading="lazy"
							sizes={SIZES}
						/>
					</button>
					<figcaption class={CAPTION}>08</figcaption>
				</figure>
			</section>

			{/* ── Lightbox ── */}
			{activeIndex.value >= 0 && (
				<div
					class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
					onClick$={close}
					onKeyDown$={$((e: KeyboardEvent) => {
						if (e.key === "Escape") close();
						if (e.key === "ArrowLeft") prev();
						if (e.key === "ArrowRight") next();
					})}
				>
					<button
						type="button"
						class="btn btn-ghost absolute top-4 right-4 z-10 text-white hover:bg-white/10"
						onClick$={$((e: Event) => {
							e.stopPropagation();
							close();
						})}
						aria-label={t("app.common.close@@Close")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="size-6"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<title>{t("app.common.close@@Close")}</title>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>

					<span class="absolute top-4 left-4 z-10 font-main text-sm text-white/60">
						{activeIndex.value + 1} / {COUNT}
					</span>

					<button
						type="button"
						class="btn btn-ghost absolute left-2 z-10 text-white hover:bg-white/10 md:left-4"
						onClick$={$((e: Event) => {
							e.stopPropagation();
							prev();
						})}
						aria-label={t("app.common.previous@@Previous")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="size-6"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<title>{t("app.common.previous@@Previous")}</title>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>

					<button
						type="button"
						class="btn btn-ghost absolute right-2 z-10 text-white hover:bg-white/10 md:right-4"
						onClick$={$((e: Event) => {
							e.stopPropagation();
							next();
						})}
						aria-label={t("app.common.next@@Next")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="size-6"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<title>{t("app.common.next@@Next")}</title>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>

					<div
						class="flex max-h-[85vh] max-w-[90vw] items-center justify-center"
						onClick$={(e: Event) => e.stopPropagation()}
					>
						{activeIndex.value === 0 && (
							<ImgCoralManicure alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 1 && (
							<ImgPedicure4 alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 2 && (
							<ImgNudeManicure alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 3 && (
							<ImgPearlManicure alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 4 && (
							<ImgChromeManicure alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 5 && (
							<ImgPedicure5 alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 6 && (
							<ImgLashes alt="" class={LIGHTBOX_IMG} />
						)}
						{activeIndex.value === 7 && (
							<ImgLashlift alt="" class={LIGHTBOX_IMG} />
						)}
					</div>
				</div>
			)}

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
						<span class="font-main text-xs font-semibold uppercase tracking-[0.18em]">
							instagram
						</span>
					</div>
					<h3 class="card-title text-3xl font-normal leading-none md:text-4xl">
						{t("app.instagram.title@@Follow the studio beyond the appointment")}
					</h3>
					<p class="font-main text-sm leading-relaxed text-base-content">
						{t(
							"app.instagram.description@@Fresh sets, studio moments, and new work from our team.",
						)}
					</p>
					<div class="card-actions mt-1">
						<span class="btn btn-sm min-h-11 px-4 font-main text-xs font-semibold uppercase tracking-[0.1em]">
							@aestheticlabbe
						</span>
					</div>
				</div>
			</a>
		</SectionWrapper>
	);
});
