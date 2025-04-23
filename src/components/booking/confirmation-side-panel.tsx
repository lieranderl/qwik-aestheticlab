import type { Signal } from "@builder.io/qwik";
import { useClickOutside } from "@ditadi/qwik-hooks";
import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { HiCheckCircleOutline } from "@qwikest/icons/heroicons";
import { formatPrice } from "~/consts";
import type { Technician, TimeSlot } from "~/types";
import { inlineTranslate, useFormatDate } from "qwik-speak";

const calculateEndTime = (selectedSlotStart: string, duration: number) => {
	const startDate = new Date(selectedSlotStart);
	const endDate = new Date(startDate.getTime() + duration * 60000); // Convert duration from minutes to milliseconds
	return endDate.toISOString();
};

export interface ConfirmationPanelProps {
	isOpen: Signal<boolean>;
	isValid: boolean;
	isSubmitting: boolean;
	selectedSlot: TimeSlot | null;
	selectedTechnician: Technician | null;
	selectedServicesNames: string[];
	duration: number;
	price: number;
}

export const ConfirmationSidePanel = component$<ConfirmationPanelProps>(
	({
		isOpen,
		isValid,
		isSubmitting,
		selectedSlot,
		selectedServicesNames,
		selectedTechnician,
		duration,
		price,
	}) => {
		const onClose$ = $(() => {
			isOpen.value = false;
		});

		const ref = useSignal<HTMLDivElement>();
		const t = inlineTranslate();
		const fd = useFormatDate();
		useClickOutside(
			ref,
			$(() => {
				if (isOpen.value) {
					isOpen.value = false;
				}
			}),
		);

		const modalSig = useSignal<HTMLDialogElement | null>(null);

		useOnDocument(
			"DOMContentLoaded",
			$(() => {
				modalSig.value = document.getElementById(
					"confirmation_modal",
				) as HTMLDialogElement;
			}),
		);

		return (
			<div
				ref={ref}
				class={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-base-100  shadow-2xl transform transition-transform duration-300 ease-in-out z-50  ${
					isOpen.value ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div class="flex flex-col h-full font-sans">
					<div class="px-6 py-4 border-b border-secondary font-qestero text-2xl font-semibold text-center">
						{t("app.booking.confirm@@Confirm Your Booking")}
					</div>

					<div class="p-6 space-y-4 overflow-y-auto flex-1">
						<div class="card shadow-sm p-4 bg-base-200">
							<h3 class="text-lg font-semibold font-sans mb-1 text-end">
								{t("app.booking.appointment_details@@Appointment Details")}
							</h3>
							<p class="text-sm ms-2 mb-1 text-end">
								{selectedSlot?.start && selectedSlot.end ? (
									<>
										<span class="font-semibold">
											{fd(selectedSlot.start, { dateStyle: "medium" })}
										</span>
										<br />
										{t("app.booking.from@@From")}{" "}
										<span class="font-semibold">
											{fd(selectedSlot.start, { timeStyle: "short" })}
										</span>{" "}
										{t("app.booking.to@@To")}{" "}
										<span class="font-semibold">
											{fd(calculateEndTime(selectedSlot.start, duration), {
												timeStyle: "short",
											})}
										</span>
									</>
								) : (
									""
								)}
							</p>
							{duration > 0 && (
								<p class="text-sm ms-2 text-end">
									{t("app.booking.total_duration@@Total Duration:")}{" "}
									<span class="font-semibold ">{duration}</span>{" "}
									{t("app.booking.minutes@@minutes")}
								</p>
							)}
						</div>

						<div class="card  shadow-sm p-4 bg-base-200">
							<h3 class="text-lg font-semibold font-sans mb-1 text-end">
								{t("app.booking.services@@Services")}
							</h3>
							<ul class="list-none list-inside ms-2 text-end">
								{selectedServicesNames.map((service) => (
									<li key={service}>{service}</li>
								))}
							</ul>
						</div>

						<div class="card shadow-sm p-4 bg-base-200">
							<h3 class="text-lg font-semibold font-sans mb-1 text-end">
								{t("app.booking.specialist@@Specialist")}
							</h3>
							<p class="font-semibold ms-2 text-end">
								{selectedTechnician?.name}
							</p>
							<p class="text-sm font-inter ms-2 text-end">
								{selectedTechnician?.role}
							</p>
						</div>

						<div class="card  shadow-sm p-4 bg-base-200">
							<h3 class="text-lg font-semibold font-sans mb-1 text-end">
								{t("app.booking.total_price@@Total Price")}
							</h3>
							<p class="text-xl font-semibold ms-2 text-end">
								{formatPrice(price)}
							</p>
						</div>
					</div>

					<div class="p-6 card mb-10">
						<div class="flex gap-6">
							<button
								type="button"
								onClick$={onClose$}
								class="btn btn-outline btn-error"
								disabled={isSubmitting}
							>
								{t("app.booking.cancel@@Cancel")}
							</button>
							<button
								type="submit"
								class="btn btn-success w-44"
								disabled={isSubmitting || !isValid}
								onClick$={() => {
									modalSig.value?.showModal();
									isOpen.value = false;
								}}
							>
								<HiCheckCircleOutline class="w-5 h-5" />{" "}
								{t("app.booking.confirm@@Confirm")}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	},
);
