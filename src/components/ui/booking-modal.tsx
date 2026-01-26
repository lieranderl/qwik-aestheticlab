import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { baseUrlBooking } from "~/consts";

interface BookingProps {
	id: string; // unique per service
	text: string;
	classes?: string;
	location: string;
	category?: string;
	product?: string;
	staff?: string;
}

export const Booking = component$<BookingProps>(
	({
		id,
		text,
		classes = "btn btn-primary",
		location,
		category,
		product,
		staff,
	}) => {
		const t = inlineTranslate();
		const isOpen = useSignal(false);

		// Build iframe URL
		const params = new URLSearchParams({ location });
		if (category) params.set("category", category);
		if (product) params.set("product", product);
		if (staff) params.set("staff", staff);
		const iframeUrl = `${baseUrlBooking}?${params.toString()}`;

		// Reset state when modal closes
		useOnDocument(
			"DOMContentLoaded",
			$(() => {
				const modal = document.getElementById(id) as HTMLDialogElement;
				if (modal) {
					modal.addEventListener("close", () => {
						isOpen.value = false;
					});
				}
			}),
		);

		const openModal = $(() => {
			const modal = document.getElementById(id) as HTMLDialogElement;
			if (modal) {
				isOpen.value = true;
				modal.showModal();
			}
		});

		return (
			<>
				{/* Trigger button */}
				<button type="button" class={classes} onClick$={openModal}>
					{text}
				</button>

				{/* Modal with iframe */}
				<dialog id={id} class="modal">
					<div class="modal-box w-full max-w-5xl p-2 pt-10">
						<form method="dialog">
							<button
								type="submit"
								class="btn btn-sm btn-square btn-ghost absolute right-1 top-1"
							>
								✕
							</button>
						</form>
						{isOpen.value && (
							<iframe
								title={t("app.booking.widget_title@@Booking Widget")}
								src={iframeUrl}
								class="w-full h-[75vh] rounded-lg border-0"
							/>
						)}
					</div>
				</dialog>
			</>
		);
	},
);
