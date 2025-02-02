import { component$ } from '@builder.io/qwik';
import type { TechnicianSlots, TimeSlot, Technician } from '~/types';

export interface TimeSlotsProps {
  availableSlots: TechnicianSlots[];
  selectedSlot: { start: string; end: string } | null;
  selectedTechnician: Technician | null;
  onSlotSelect$: (slot: TimeSlot, technician: Technician) => void;
}

export default component$<TimeSlotsProps>(({
  availableSlots,
  selectedSlot,
  selectedTechnician,
  onSlotSelect$
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div class="space-y-6">
      {availableSlots.map((techSlots) => (
        <div key={techSlots.technician.id} class="border border-sage-200 rounded-lg p-4">
          <div class="flex items-center gap-4 mb-4">
            <img 
              src={techSlots.technician.photo_url} 
              alt={techSlots.technician.name}
              class="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 class="font-medium text-sage-800">{techSlots.technician.name}</h3>
              <p class="text-sm text-sage-600 capitalize">{techSlots.technician.role || 'Technician'}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {techSlots.slots.map((slot, index) => (
              slot.status != 'busy' && <button
                key={index}
                type="button"
                onClick$={() => onSlotSelect$(slot, techSlots.technician)}
                class={`p-2 text-sm rounded-md ${
                  selectedSlot?.start === slot.start && selectedTechnician?.id === techSlots.technician.id
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});