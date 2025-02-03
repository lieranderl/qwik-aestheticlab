import { $, component$, Signal } from "@builder.io/qwik";
import type { Service } from "~/types";

export interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Signal<string[]>;
  totalDuration: number;
  //   onToggleService$: (serviceId: string) => void;
}

export const ServiceSelector = component$<ServiceSelectorProps>(
  ({
    services,
    selectedServices,
    totalDuration,
    //   onToggleService$
  }) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    };

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
          <label class="block text-sm font-medium mb-3">Select Services</label>
          <div class="space-y-3">
            {services.map((service: Service) => (
              <div key={service.id} class="flex items-center">
                <input
                  type="checkbox"
                  class="checkbox"
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

        {selectedServices.value.length > 0 && (
          <div class="bg-sage-50 p-4 rounded-md">
            <p class="text-sm text-sage-700">
              Total Duration: {totalDuration} minutes
            </p>
          </div>
        )}
      </div>
    );
  }
);
