import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

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
		const isOpen = useSignal(false);

		// Build iframe URL
		const baseUrl = "https://bookings.gettimely.com/aestheticlab2/bb/book";
		const params = new URLSearchParams({ location });
		if (category) params.set("category", category);
		if (product) params.set("product", product);
		if (staff) params.set("staff", staff);
		const iframeUrl = `${baseUrl}?${params.toString()}`;

		// Reset state when modal closes
		useVisibleTask$(() => {
			const modal = document.getElementById(id) as HTMLDialogElement;
			if (modal) {
				modal.addEventListener("close", () => {
					isOpen.value = false;
				});
			}
		});

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
					<div class="modal-box w-11/12 max-w-5xl">
						{isOpen.value && (
							<iframe
								title="Booking Widget"
								src={iframeUrl}
								class="w-full h-[75vh] rounded-lg border-0"
							/>
						)}
					</div>
					<form method="dialog" class="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>
			</>
		);
	},
);
