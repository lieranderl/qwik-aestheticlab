import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { inlineTranslate, useFormatDate } from "qwik-speak";
import { formatPrice } from "~/consts";
import type { Booking } from "~/types";

export interface UpcomingAppointmentProps {
	upcomingAppointments: Booking[];
	useRemoveBookingAction: ActionStore<
		{
			success: boolean;
		},
		Record<string, unknown>,
		true
	>;
}
export const UpcomingAppointment = component$(
	({
		upcomingAppointments,
		useRemoveBookingAction,
	}: UpcomingAppointmentProps) => {
		const t = inlineTranslate();
		const fd = useFormatDate();
		return (
			<>
				{upcomingAppointments.length > 0 && (
					<>
						<div class="text-primary text-center text-xl md:text-4xl font-qestero font-semibold mb-4">
							{t(
								"app.booking.upcoming_appointments@@Your Upcoming Appointments",
							)}
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
							{upcomingAppointments.map((booking) => (
								<div key={booking.id} class="card bg-base-100 shadow-md">
									<div class="card-body">
										<div class="flex justify-between">
											<strong>{t("app.booking.services@@Services:")}</strong>
											<span>{booking.services_names.join(", ")}</span>
										</div>
										<div class="flex justify-between">
											<strong>{t("app.booking.duration@@Duration:")}</strong>
											<span>
												{booking.duration}
												{t("app.booking.minutes@@minutes")}
											</span>
										</div>
										<div class="flex justify-between">
											<strong>{t("app.booking.price@@Price:")}</strong>
											<span>{formatPrice(booking.price)}</span>
										</div>
										<div class="flex justify-between">
											<strong>{t("app.booking.date@@Date:")}</strong>
											<span>
												{fd(booking.datetime, { dateStyle: "medium" })}
											</span>
										</div>
										<div class="flex justify-between">
											<strong>{t("app.booking.time@@Time:")}</strong>
											<span>
												{fd(booking.datetime, { timeStyle: "short" })}
											</span>
										</div>
										<div class="card-actions justify-end pt-4">
											<button
												type="button"
												class="btn btn-error"
												disabled={useRemoveBookingAction.isRunning}
												onClick$={() =>
													useRemoveBookingAction.submit({
														bookingId: booking.id,
													})
												}
											>
												{useRemoveBookingAction.isRunning ? (
													<span class="loading loading-spinner me-2 loading-md" />
												) : (
													<span>{t("app.booking.remove@@Remove")}</span>
												)}
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</>
		);
	},
);
