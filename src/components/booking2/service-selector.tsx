import type { Signal } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import type { Service } from "~/types";

export interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Signal<string[]>;
  totalDuration: number;
  showConfirmationPanelSignal: Signal<boolean>;
}

export const ServiceSelector = component$<ServiceSelectorProps>(
  ({
    services,
    selectedServices,
    totalDuration,
    showConfirmationPanelSignal,
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
          <div class="block text-sm font-medium mb-3">Select Services</div>
          <div class="space-y-3">
            {services.map((service: Service) => (
              <div key={service.id} class="flex items-center">
                <input
                  type="checkbox"
                  class="checkbox"
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

        {selectedServices.value.length > 0 && (
          <div class="bg-neutral p-2 rounded-md">
            <p class="text-sm">
              Total Duration: {totalDuration} minutes
              <input name="duraiton" hidden value={totalDuration} />
            </p>
          </div>
        )}
      </div>
    );
  }
);
