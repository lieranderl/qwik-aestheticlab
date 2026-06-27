import { $, component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { baseUrlBooking } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

interface BookingProps {
	id: string; // unique per service
	text: string;
	classes?: string;
	location: string;
	category?: string;
	product?: string;
	staff?: string;
	analyticsPlacement?: string;
	analyticsServiceId?: string;
	analyticsServiceName?: string;
	analyticsServiceCategory?: string;
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
		analyticsPlacement,
		analyticsServiceId,
		analyticsServiceName,
		analyticsServiceCategory,
	}) => {
		const t = inlineTranslate();
		const isOpen = useSignal(false);
		const eventParams = {
			booking_id: id,
			placement: analyticsPlacement || id,
			booking_location: location,
			service_id: analyticsServiceId,
			service_name: analyticsServiceName,
			service_category: analyticsServiceCategory || category,
			booking_product: product,
			staff_id: staff,
		};

		// Build iframe URL
		const params = new URLSearchParams({ location });
		if (category) params.set("category", category);
		if (product) params.set("product", product);
		if (staff) params.set("staff", staff);
		const iframeUrl = `${baseUrlBooking}?${params.toString()}`;

		const openModal = $(() => {
			const modal = document.getElementById(id) as HTMLDialogElement;
			if (modal) {
				isOpen.value = true;
				modal.showModal();

				trackGoogleAnalyticsEvent("booking_opened", eventParams);
				if (
					analyticsServiceId ||
					analyticsServiceName ||
					analyticsServiceCategory ||
					category ||
					product ||
					staff
				) {
					trackGoogleAnalyticsEvent("service_booking_opened", eventParams);
				}
			}
		});

		return (
			<>
				{/* Trigger button */}
				<button type="button" class={classes} onClick$={openModal}>
					{text}
				</button>

				{/* Modal with iframe */}
				<dialog
					id={id}
					class="modal"
					onClose$={$(() => {
						isOpen.value = false;
					})}
				>
					<div class="modal-box w-full max-w-5xl p-2 pt-10 bg-base-200 rounded-2xl">
						<form method="dialog">
							<button
								type="submit"
								class="btn btn-sm btn-square btn-ghost absolute right-1 top-1"
								aria-label={t("app.common.close@@Close")}
							>
								<span aria-hidden="true">✕</span>
							</button>
						</form>
						{isOpen.value && (
							<iframe
								title={t("app.booking.widget_title@@Booking Widget")}
								src={iframeUrl}
								class="w-full h-[75vh] rounded-lg border-0"
								onLoad$={$(() => {
									trackGoogleAnalyticsEvent(
										"booking_widget_loaded",
										eventParams,
									);
								})}
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
