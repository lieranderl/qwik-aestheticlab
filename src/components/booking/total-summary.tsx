import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { formatPrice } from "~/consts";

export interface TotalSummaryProps {
	selectedServicesNames: string[];
	selectedServices: string[];
	totalDuration: number;
	totalPrice: number;
}
export const TotalSummary = component$<TotalSummaryProps>(
	({ selectedServicesNames, selectedServices, totalDuration, totalPrice }) => {
		const scaled = useSignal(false);
		const t = inlineTranslate();
		useTask$(({ track }) => {
			track(() => totalPrice);
			setTimeout(() => {
				scaled.value = false;
			}, 300);
			scaled.value = true;
		});

		return (
			<>
				{selectedServices.length > 0 && (
					<div class="alert alert-info flex-col alert-soft flex justify-between">
						<div>
							<p class="font-semibold text-center">
								{t("app.booking.selected_services@@Selected Services")}
							</p>
							<p>{selectedServicesNames.join(", ")}</p>
						</div>
						<div class="flex justify-between w-full">
							<div>
								<p class="font-semibold">

									{t("app.booking.total_duration@@Total Duration:")}
								</p>
								<p>
									{totalDuration}{" "}
									{t("app.booking.minutes@@min")}
								</p>
							</div>
							<div>
								<p class="font-semibold">
									{t("app.booking.total_price@@Total Price:")}
								</p>
								<p
									class={{
										"transition-transform transform duration-200 ease-in-out text-center font-semibold": true,
										"scale-110 font-bold": scaled.value,
										"scale-100": !scaled.value,
									}}
								>
									{formatPrice(totalPrice)}
								</p>
							</div>
						</div>
					</div>
				)}
			</>
		);
	},
);
