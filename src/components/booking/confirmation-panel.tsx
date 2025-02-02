import { component$ } from '@builder.io/qwik';
import type { Service, Technician } from '~/types';

export interface ConfirmationPanelProps {
  isOpen: boolean;
  onClose$: () => void;
  onConfirm$: () => void;
  isSubmitting: boolean;
  selectedDate: string;
  selectedSlot: { start: string; end: string };
  selectedTechnician: Technician;
  selectedServices: string[];
  services: Service[];
  error?: string;
}

export default component$<ConfirmationPanelProps>(({
  isOpen,
  onClose$,
  onConfirm$,
  isSubmitting,
  selectedDate,
  selectedSlot,
  selectedTechnician,
  selectedServices,
  services,
  error
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getSelectedServiceNames = () => {
    return selectedServices.map(serviceId => {
      const service = services.find((s: Service) => s.id === serviceId);
      return service?.name;
    }).filter(Boolean);
  };

  return (
    <div 
      class={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div class="h-full flex flex-col">
        <div class="p-6 border-b border-sage-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-serif text-sage-800">
              {error ? 'Booking Failed' : 'Confirm Your Appointment'}
            </h3>
            <button
              onClick$={onClose$}
              class="text-sage-500 hover:text-sage-700 transition-colors"
              aria-label="Close panel"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error ? (
            <p class="text-red-600 mb-4">{error}</p>
          ) : (
            <div class="space-y-4">
              <div class="bg-sage-50 p-4 rounded-lg">
                <p class="text-sage-700 font-medium mb-2">
                  {selectedDate}
                </p>
                <p class="text-sage-700">
                  {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
                </p>
              </div>

              <div class="border-t border-b border-sage-100 py-4">
                <div class="flex items-center gap-4">
                  <img 
                    src={selectedTechnician.photo_url} 
                    alt={selectedTechnician.name}
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-medium text-sage-800">{selectedTechnician.name}</p>
                    <p class="text-sm text-sage-600 capitalize">{selectedTechnician.role || 'Technician'}</p>
                  </div>
                </div>
              </div>

              <div>
                <p class="font-medium text-sage-800 mb-2">Selected Services:</p>
                <ul class="space-y-2">
                  {getSelectedServiceNames().map((serviceName, index) => (
                    <li key={index} class="text-sage-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {serviceName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div class="mt-auto p-6 bg-sage-50">
          <div class="flex gap-3">
            <button
              onClick$={onClose$}
              class="flex-1 px-6 py-2 rounded-full border border-sage-300 text-sage-700 hover:bg-sage-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick$={onConfirm$}
              disabled={isSubmitting || error !== undefined}
              class="flex-1 bg-sage-600 text-white px-6 py-2 rounded-full hover:bg-sage-700 transition-colors disabled:bg-sage-300"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});