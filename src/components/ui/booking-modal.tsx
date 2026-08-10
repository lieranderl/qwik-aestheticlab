import { $, component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { baseUrlBooking } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

export interface BookingProps {
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
		const isLoaded = useSignal(false);
		const titleId = `${id}-title`;
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
				isLoaded.value = false;
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
				<button
					type="button"
					class={[
						classes,
						"motion-safe:active:scale-[0.97] motion-safe:transition-transform motion-safe:duration-100",
					]
						.filter(Boolean)
						.join(" ")}
					onClick$={openModal}
				>
					{text}
				</button>

				{/* Modal with iframe */}
				<dialog
					id={id}
					class="modal modal-bottom sm:modal-middle"
					aria-labelledby={titleId}
					aria-modal="true"
					onClose$={$(() => {
						isOpen.value = false;
						isLoaded.value = false;
					})}
				>
					<div class="modal-box relative flex min-h-[70vh] w-full max-w-5xl flex-col rounded-t-3xl bg-base-100 p-2 pt-12 sm:min-h-[50vh] sm:w-[calc(100%-1rem)] sm:rounded-2xl">
						<h2 id={titleId} class="sr-only">
							{text}
						</h2>
						<form method="dialog">
							<button
								type="submit"
								class="btn btn-ghost btn-square absolute right-1 top-1 min-h-11 min-w-11"
								aria-label={t("app.common.close@@Close")}
							>
								<span aria-hidden="true">✕</span>
							</button>
						</form>
						{isOpen.value && (
							<div
								class="relative min-h-[60vh] grow"
								aria-busy={!isLoaded.value}
							>
								{!isLoaded.value ? (
									<div
										class="absolute inset-0 flex items-center justify-center"
										role="status"
									>
										<span class="loading loading-spinner loading-lg text-secondary" />
										<span class="sr-only">
											{t("app.booking.loading@@Loading booking options")}
										</span>
									</div>
								) : null}
								<iframe
									title={t("app.booking.widget_title@@Booking Widget")}
									src={iframeUrl}
									class={
										isLoaded.value
											? "h-[75vh] w-full translate-y-0 rounded-2xl border-0 opacity-100 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none"
											: "h-[75vh] w-full translate-y-2 rounded-2xl border-0 opacity-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none"
									}
									onLoad$={$(() => {
										isLoaded.value = true;
										trackGoogleAnalyticsEvent(
											"booking_widget_loaded",
											eventParams,
										);
									})}
								/>
							</div>
						)}
					</div>
					<form method="dialog" class="modal-backdrop">
						<button type="submit">{t("app.common.close@@Close")}</button>
					</form>
				</dialog>
			</>
		);
	},
);
