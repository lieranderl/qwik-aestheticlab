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
    const groupedServices = services.reduce(
      (acc, service) => {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
      },
      {} as Record<string, Service[]>
    );

    const onToggleService$ = $(
      (e: Event, serviceId: string, category: string) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          selectedServices.value = selectedServices.value.filter(
            (id) =>
              !groupedServices[category].some((service) => service.id === id)
          );
          selectedServices.value.push(serviceId);
        } else {
          selectedServices.value = selectedServices.value.filter(
            (id) => id !== serviceId
          );
        }
      }
    );

    return (
      <div>
        <div class="block text-sm font-medium mb-3">Select Services</div>
        <div class="space-y-4">
          {Object.entries(groupedServices).map(([category, services]) => (
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
                      <span class="text-sm">{service.name}</span>
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
  }
);
