import { component$ } from '@builder.io/qwik';
import type { Service, Technician } from '~/types';

export interface ConfirmationModalProps {
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

export default component$<ConfirmationModalProps>(({
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
  if (!isOpen) return null;

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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        {error ? (
          <>
            <h3 class="text-xl font-serif text-sage-800 mb-4">Booking Failed</h3>
            <p class="text-red-600 mb-6">{error}</p>
            <div class="flex justify-end">
              <button
                onClick$={onClose$}
                class="bg-sage-600 text-white px-6 py-2 rounded-full hover:bg-sage-700 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 class="text-xl font-serif text-sage-800 mb-4">Confirm Your Appointment</h3>
            <div class="space-y-3 mb-6">
              <p class="text-sage-700">
                {selectedDate} at {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
              </p>
              <p class="text-sage-700">
                with {selectedTechnician.name}
              </p>
              <div class="text-sage-700">
                <p class="font-medium">Services:</p>
                <ul class="list-disc list-inside">
                  {getSelectedServiceNames().map((serviceName, index) => (
                    <li key={index}>{serviceName}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button
                onClick$={onClose$}
                class="px-6 py-2 rounded-full border border-sage-300 text-sage-700 hover:bg-sage-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick$={onConfirm$}
                disabled={isSubmitting}
                class="bg-sage-600 text-white px-6 py-2 rounded-full hover:bg-sage-700 transition-colors disabled:bg-sage-300"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});