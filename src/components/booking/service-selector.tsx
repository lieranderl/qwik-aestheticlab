import { component$ } from '@builder.io/qwik';
import type { Service } from '~/types';

export interface ServiceSelectorProps {
  services: Service[];
  selectedServices: string[];
  totalDuration: number;
  onToggleService$: (serviceId: string) => void;
}

export default component$<ServiceSelectorProps>(({
  services,
  selectedServices,
  totalDuration,
  onToggleService$
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-sage-700 mb-3">
          Select Services
        </label>
        <div class="space-y-3">
          {services.map((service: Service) => (
            <div key={service.id} class="flex items-center">
              <input
                type="checkbox"
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onChange$={() => onToggleService$(service.id)}
                class="h-4 w-4 text-sage-600 focus:ring-sage-500 border-sage-300 rounded"
              />
              <label for={service.id} class="ml-3 flex justify-between items-center w-full">
                <span class="text-sm text-sage-700">{service.name}</span>
                <span class="text-sm text-sage-600">
                  {formatPrice(service.price)} - {service.duration} min
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div class="bg-sage-50 p-4 rounded-md">
          <p class="text-sm text-sage-700">
            Total Duration: {totalDuration} minutes
          </p>
        </div>
      )}
    </div>
  );
});