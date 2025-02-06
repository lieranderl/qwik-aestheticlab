import type { Signal } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { formatPrice } from "~/consts";
import type { Service } from "~/types";

export interface ServiceSelectorProps {
	services: Service[];
	selectedServices: Signal<string[]>;
	totalDuration: number;
	totalPrice: number;
}

export const ServiceSelector = component$<ServiceSelectorProps>(
	({ services, selectedServices }) => {
		const onToggleService$ = $((serviceId: string) => {
			if (selectedServices.value.includes(serviceId)) {
				const newServices = [...selectedServices.value];
				selectedServices.value = newServices.filter((id) => id !== serviceId);
			} else {
				selectedServices.value = [...selectedServices.value, serviceId];
			}
		});

		return (
			<div class="space-y-6">
				<div>
					<div class="block text-sm font-medium mb-3">Select Services</div>
					<div class="space-y-3">
						{services.map((service: Service) => (
							<div key={service.id} class="flex items-center">
								<input
									type="checkbox"
									class="checkbox checkbox-primary"
									name={`services.${service.id}`}
									id={service.id}
									checked={selectedServices.value.includes(service.id)}
									onChange$={() => onToggleService$(service.id)}
								/>
								<label
									for={service.id}
									class="ml-3 flex justify-between items-center w-full"
								>
									<span class="text-sm ">{service.name}</span>
									<span class="text-sm ">
										{formatPrice(service.price)} - {service.duration} min
									</span>
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},
);
