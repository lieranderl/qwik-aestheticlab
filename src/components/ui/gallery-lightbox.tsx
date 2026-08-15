import { $, component$, type Signal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import ImgChromeManicure from "~/media/gallery/atelier/chrome-manicure.jpg?jsx";
import ImgCoralManicure from "~/media/gallery/atelier/coral-manicure.jpg?jsx";
import ImgLashes from "~/media/gallery/atelier/lashes.jpg?jsx";
import ImgLashlift from "~/media/gallery/atelier/lashlift.jpg?jsx";
import ImgNudeManicure from "~/media/gallery/atelier/nude-manicure.jpg?jsx";
import ImgPearlManicure from "~/media/gallery/atelier/pearl-manicure.jpg?jsx";
import ImgPedicure4 from "~/media/gallery/pedicure4.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";

export const galleryLightboxId = "gallery-lightbox";
export const galleryLightboxCloseId = "gallery-lightbox-close";
const galleryItemCount = 8;

interface GalleryLightboxProps {
	activeIndex: Signal<number>;
	openerId: Signal<string>;
}

export const GalleryLightbox = component$<GalleryLightboxProps>(
	({ activeIndex, openerId }) => {
		const t = inlineTranslate();
		const items = [
			{
				Image: ImgCoralManicure,
				alt: t(
					"app.work.alt.coral_manicure@@Bright coral-red manicure on both hands",
				),
			},
			{
				Image: ImgPedicure4,
				alt: t("app.work.alt.p2@@Refined toenail polish finish"),
			},
			{
				Image: ImgNudeManicure,
				alt: t(
					"app.work.alt.nude_manicure@@Soft nude manicure with a clean glossy finish",
				),
			},
			{
				Image: ImgPearlManicure,
				alt: t("app.work.alt.pearl_manicure@@Pearlescent pink manicure detail"),
			},
			{
				Image: ImgChromeManicure,
				alt: t("app.work.alt.chrome_manicure@@Pink chrome manicure detail"),
			},
			{
				Image: ImgPedicure5,
				alt: t("app.work.alt.p5@@Aesthetic pedicure detailing"),
			},
			{
				Image: ImgLashes,
				alt: t("app.work.alt.lashes@@Lash extensions result"),
			},
			{
				Image: ImgLashlift,
				alt: t("app.work.alt.lashlift@@Lash lift result"),
			},
		];
		const item = items[activeIndex.value] ?? items[0];
		const ActiveImage = item.Image;

		const close = $(() => {
			(
				document.getElementById(galleryLightboxId) as HTMLDialogElement
			)?.close();
		});
		const previous = $((event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			activeIndex.value =
				(activeIndex.value - 1 + galleryItemCount) % galleryItemCount;
		});
		const next = $((event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			activeIndex.value = (activeIndex.value + 1) % galleryItemCount;
		});

		return (
			<dialog
				id={galleryLightboxId}
				class="modal bg-black/90 p-0 backdrop:bg-black/90"
				aria-label={t("app.work.lightbox_label@@Gallery image viewer")}
				onClick$={$((event: MouseEvent, element: HTMLDialogElement) => {
					if (event.target === element) element.close();
				})}
				onKeyDown$={$((event: KeyboardEvent) => {
					if (event.key === "ArrowLeft" || event.key === "<") {
						event.preventDefault();
						activeIndex.value =
							(activeIndex.value - 1 + galleryItemCount) % galleryItemCount;
					}
					if (event.key === "ArrowRight" || event.key === ">") {
						event.preventDefault();
						activeIndex.value = (activeIndex.value + 1) % galleryItemCount;
					}
				})}
				onClose$={$(() => {
					activeIndex.value = -1;
					const triggerId = openerId.value;
					requestAnimationFrame(() => {
						document.getElementById(triggerId)?.focus();
					});
				})}
			>
				<div class="modal-box flex h-dvh max-h-none w-screen max-w-none items-center justify-center overflow-hidden rounded-none bg-transparent p-4 shadow-none">
					<button
						id={galleryLightboxCloseId}
						type="button"
						class="btn btn-ghost btn-square absolute top-4 right-4 z-10 min-h-11 min-w-11 text-white hover:bg-white/10"
						onClick$={close}
						aria-label={t("app.common.close@@Close")}
					>
						<span aria-hidden="true" class="text-2xl">
							×
						</span>
					</button>

					<span class="absolute top-4 left-4 z-10 font-main text-sm text-white/70">
						{activeIndex.value + 1} / {galleryItemCount}
					</span>

					<button
						type="button"
						class="btn btn-ghost btn-square absolute left-2 z-20 min-h-12 min-w-12 touch-manipulation text-white hover:bg-white/10 md:left-4"
						onClick$={previous}
						aria-label={t("app.common.previous@@Previous")}
					>
						<span aria-hidden="true" class="text-3xl">
							‹
						</span>
					</button>

					<ActiveImage
						key={activeIndex.value}
						alt={item.alt}
						class="max-h-[85vh] max-w-[90vw] rounded-box object-contain"
					/>

					<button
						type="button"
						class="btn btn-ghost btn-square absolute right-2 z-20 min-h-12 min-w-12 touch-manipulation text-white hover:bg-white/10 md:right-4"
						onClick$={next}
						aria-label={t("app.common.next@@Next")}
					>
						<span aria-hidden="true" class="text-3xl">
							›
						</span>
					</button>
				</div>
			</dialog>
		);
	},
);
