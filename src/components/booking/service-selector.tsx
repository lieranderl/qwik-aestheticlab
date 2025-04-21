import type { Signal } from "@builder.io/qwik";
import { $, component$, useComputed$ } from "@builder.io/qwik";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";
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
		const local = useSpeakLocale();
		const shortlang = local.lang.split("-")[0];
		// Group services by category ID
		// and create a mapping of category ID to category name, based on language
		const groupedServices = useComputed$(() => {
			const grouped = services.reduce(
				(acc, service) => {
					const category = serviceCategorySignal.value.find(
						(cat) => cat.id === service.category_id,
					);
					if (category) {
						const categoryName =
							shortlang === "en"
								? category.name
								: shortlang === "ru"
									? category.name_ru
									: shortlang === "nl"
										? category.name_nl
										: shortlang === "fr"
											? category.name_fr
											: category.name;
						if (!acc[categoryName]) {
							acc[categoryName] = [];
						}
						acc[categoryName].push(service);
					}
					return acc;
				},
				{} as Record<string, Service[]>,
			);
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
											{shortlang === "en" && (
												<span class="text-sm">{service.name}</span>
											)}
											{shortlang === "ru" && (
												<span class="text-sm">{service.name_ru}</span>
											)}
											{shortlang === "nl" && (
												<span class="text-sm">{service.name_nl}</span>
											)}
											{shortlang === "fr" && (
												<span class="text-sm">{service.name_fr}</span>
											)}

											<div class="flex flex-col text-sm text-right">
												<span>{formatPrice(service.price)}</span>
												<span class="font-light">{service.duration} min</span>
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
