import type { Signal } from "@builder.io/qwik";
import { $, component$, useComputed$ } from "@builder.io/qwik";
import { HiClockOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { formatPrice } from "~/consts";
import { useServicesCategoryLoader } from "~/routes/[...lang]/layout";
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

		const groupedServices = useComputed$(() => {
			const categories = serviceCategorySignal.value;
			const desiredOrder = ["manicure", "pedicure", "eyebrows"]; // Desired order of categories
			const grouped: Record<string, Service[]> = {};

			// Sort services by price (ascending) - Creating a shallow copy
			const sortedServices = [...services].sort((a, b) => a.price - b.price);

			// Sort categories based on the desired order
			const sortedCategories = categories.sort((a, b) => {
				const indexA = desiredOrder.indexOf(a.name);
				const indexB = desiredOrder.indexOf(b.name);
				return indexA - indexB;
			});

			// Group services by category and sort services inside each category by price
			for (const category of sortedCategories) {
				const servicesInCategory = sortedServices.filter(
					(service) => service.category_id === category.id,
				);
				if (servicesInCategory.length > 0) {
					grouped[category.name] = servicesInCategory;
				}
			}
			return grouped;
		});

		const onToggleService$ = $(
			(e: Event, serviceId: string, category: string) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					selectedServices.value = [
						...selectedServices.value.filter(
							(id) =>
								!groupedServices.value[category].some(
									(service) => service.id === id,
								),
						),
						serviceId,
					];
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
											<div class="flex flex-col text-right">
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
