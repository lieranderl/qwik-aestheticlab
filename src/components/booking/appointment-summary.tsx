import { component$ } from '@builder.io/qwik';
import type { Service, Technician } from '~/types';

export interface AppointmentSummaryProps {
  selectedDate: string;
  selectedSlot: { start: string; end: string } | null;
  selectedTechnician: Technician | null;
  selectedServices: string[];
  services: Service[];
}

export default component$<AppointmentSummaryProps>(({
  selectedDate,
  selectedSlot,
  selectedTechnician,
  selectedServices,
  services
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

  if (!selectedSlot || !selectedTechnician) return null;

  return (
    <div class="bg-sage-50 p-4 rounded-md space-y-2">
      <p class="text-sm font-medium text-sage-800">Selected Appointment:</p>
      <p class="text-sm text-sage-700">
        {selectedDate} at {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
      </p>
      <p class="text-sm text-sage-700">
        with {selectedTechnician.name}
      </p>
      <div class="text-sm text-sage-700">
        <p class="font-medium mb-1">Services:</p>
        <ul class="list-disc list-inside">
          {getSelectedServiceNames().map((serviceName, index) => (
            <li key={index}>{serviceName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});