import type { Signal } from "@builder.io/qwik";
import { $, component$, useComputed$ } from "@builder.io/qwik";
import { HiClockOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { formatPrice } from "~/consts";
import { useServicesCategoryLoader } from "~/routes/[...lang]/booking/layout";
import type { Service } from "~/types";

export interface ServiceSelectorProps {
	services: Service[];
	selectedServices: Signal<string[]>;
	totalDuration: number;
	totalPrice: number;
}

export const ServiceSelector = component$<ServiceSelectorProps>(
	({ services, selectedServices }) => {
		const serviceCategorySignal = useServicesCategoryLoader();
		const t = inlineTranslate();

		// Group services by category name from serviceCategorySignal based on ID
		const groupedServices = useComputed$(() => {
			const categories = serviceCategorySignal.value;
			const grouped: Record<string, Service[]> = {};
			for (const service of services.sort((a, b) => b.price - a.price)) {
				const category = categories.find(
					(cat) => cat.id === service.category_id,
				);
				if (category) {
					if (!grouped[category.name]) {
						grouped[category.name] = [];
					}
					grouped[category.name].push(service);
				}
			}
			return grouped;
		});

		const onToggleService$ = $(
			(e: Event, serviceId: string, category: string) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					selectedServices.value = selectedServices.value.filter(
						(id) =>
							!groupedServices.value[category].some(
								(service) => service.id === id,
							),
					);
					selectedServices.value.push(serviceId);
				} else {
					selectedServices.value = selectedServices.value.filter(
						(id) => id !== serviceId,
					);
				}
			},
		);

		return (
			<div>
				<div class="block text-sm font-medium mb-3">
					{t("app.booking.select_services@@Select Services")}
				</div>
				<div class="space-y-4">
					{Object.entries(groupedServices.value).map(([category, services]) => (
						<div
							key={category}
							class="collapse collapse-arrow bg-base-100 border border-base-300"
						>
							<input type="checkbox" />
							<div class="collapse-title text-md font-semibold">
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</div>
							<div class="collapse-content space-y-3">
								{services.map((service) => (
									<div key={service.id} class="flex items-center">
										<input
											type="checkbox"
											class="checkbox checkbox-primary"
											name={`services.${service.id}`}
											id={service.id}
											checked={selectedServices.value.includes(service.id)}
											onChange$={(e) =>
												onToggleService$(e, service.id, category)
											}
										/>
										<label
											for={service.id}
											class="ml-2 flex justify-between items-center w-full"
										>
											<span>{service.name}</span>
											<div class="flex flex-col  text-right ">
												<span class="font-medium">
													{formatPrice(service.price)}
												</span>
												<div class="flex justify-end items-center text-xs">
													<HiClockOutline class="mr-1" />
													<span class="font-light text-nowrap italic">
														{service.duration}"
													</span>
												</div>
											</div>
										</label>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	},
);
