import { $, component$, type Signal } from "@qwik.dev/core";
import { _ } from "compiled-i18n";
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
		const items = [
			{
				Image: ImgCoralManicure,
				alt: _`work.alt.coral_manicure`,
			},
			{
				Image: ImgPedicure4,
				alt: _`work.alt.p2`,
			},
			{
				Image: ImgNudeManicure,
				alt: _`work.alt.nude_manicure`,
			},
			{
				Image: ImgPearlManicure,
				alt: _`work.alt.pearl_manicure`,
			},
			{
				Image: ImgChromeManicure,
				alt: _`work.alt.chrome_manicure`,
			},
			{
				Image: ImgPedicure5,
				alt: _`work.alt.p5`,
			},
			{
				Image: ImgLashes,
				alt: _`work.alt.lashes`,
			},
			{
				Image: ImgLashlift,
				alt: _`work.alt.lashlift`,
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
				aria-label={_`work.lightbox_label`}
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
						aria-label={_`common.close`}
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
						aria-label={_`common.previous`}
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
						aria-label={_`common.next`}
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
