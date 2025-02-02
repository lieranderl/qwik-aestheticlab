import { component$, useSignal, useTask$, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useServicesLoader, useTechniciansLoader } from '~/routes/layout';
import type { TimeSlot, Technician, TechnicianSlots } from '~/types';

// Components
import ContactForm from '~/components/booking/contact-form';
import ServiceSelector from '~/components/booking/service-selector';
import DateSelector from '~/components/booking/date-selector';
import TimeSlots from '~/components/booking/time-slots';
import AppointmentSummary from '~/components/booking/appointment-summary';
import ConfirmationPanel from '~/components/booking/confirmation-panel';
import StatusModal from '~/components/booking/status-modal';

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default component$(() => {
  const servicesSignal = useServicesLoader();
  const techniciansSignal = useTechniciansLoader();
  
  // Form state
  const name = useSignal('');
  const email = useSignal('');
  const phone = useSignal('');
  const selectedServices = useSignal<string[]>([]);
  const totalDuration = useSignal(0);
  const selectedDate = useSignal('');
  const selectedSlot = useSignal<{ start: string; end: string } | null>(null);
  const selectedTechnician = useSignal<Technician | null>(null);
  const availableSlots = useSignal<TechnicianSlots[]>([]);
  const isSubmitting = useSignal(false);
  const showModal = useSignal(false);
  const bookingError = useSignal<string | undefined>();
  const showStatusModal = useSignal(false);
  const bookingStatus = useSignal<'success' | 'error'>('success');

  // Store form state for modal
  const formState = useSignal<{
    name: string;
    email: string;
    phone: string;
    services: string[];
    date: string;
    slot: { start: string; end: string } | null;
    technician: Technician | null;
  } | null>(null);

  const getEligibleTechnicians = $(() => {
    return techniciansSignal.value.filter((tech: Technician) => 
      tech.active && selectedServices.value.every(serviceId => 
        tech.services.includes(serviceId)
      )
    );
  });

  const getWeekday = $(async (date: string) => {
    const dayIndex = new Date(date).getDay();
    return WEEKDAYS[dayIndex];
  });

  const fetchAvailableSlots = $(async (date: string) => {
    if (!date || selectedServices.value.length === 0) {
      availableSlots.value = [];
      return;
    }

    selectedDate.value = date;
    
    const eligibleTechnicians = await getEligibleTechnicians();
    const weekday = await getWeekday(date);
    
    try {
      const slotsPromises = eligibleTechnicians.map(async (tech: Technician) => {
        const url = `https://jfedotov.app.n8n.cloud/webhook/b952a03f-d926-4afc-8d4f-9a3ce7750146/calendar/technician/${tech.id}?date=${date}&weekday=${weekday}&slot_duration=${totalDuration.value}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const slots = await response.json();
        
        if (!Array.isArray(slots) || slots.length === 0 || slots.every(slot => Object.keys(slot).length === 0)) {
          return null;
        }

        return {
          technician: tech,
          slots: slots.map(slot => ({
            start: slot.start,
            end: slot.end,
            status: slot.status
          }))
        };
      });

      const results = await Promise.all(
        slotsPromises.map(p => p.catch(error => {
          console.error('Error fetching slots for technician:', error);
          return null;
        }))
      );

      availableSlots.value = results.filter(result => 
        result !== null && 
        result.slots && 
        result.slots.length > 0 && 
        result.slots.some(slot => Object.keys(slot).length > 0)
      );
    } catch (error) {
      console.error('Error fetching slots:', error);
      availableSlots.value = [];
    }
  });

  useTask$(({ track }) => {
    track(() => selectedServices.value);
    
    totalDuration.value = selectedServices.value.reduce((total, serviceId) => {
      const service = servicesSignal.value.find((s) => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);

    availableSlots.value = [];
    
    if (selectedDate.value && selectedServices.value.length > 0) {
      void fetchAvailableSlots(selectedDate.value);
    }
  });

  const handleSubmit = $(() => {
    if (!selectedTechnician.value || !selectedSlot.value) {
      return;
    }

    // Store current form state
    formState.value = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      services: [...selectedServices.value],
      date: selectedDate.value,
      slot: selectedSlot.value,
      technician: selectedTechnician.value
    };

    showModal.value = true;
  });

  const handleConfirmBooking = $(async () => {
    isSubmitting.value = true;
    bookingError.value = undefined;
    
    if (!formState.value) return;

    try {
      const response = await fetch(`https://jfedotov.app.n8n.cloud/webhook/f5856c87-6629-4338-98b2-8580c868c441/calendar/technician/${formState.value.technician.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: formState.value.services,
          date: formState.value.slot!.start,
          weekday: await getWeekday(formState.value.date),
          user_email: formState.value.email,
          name: formState.value.name,
          phone: formState.value.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }
      
      showModal.value = false;
      bookingStatus.value = 'success';
      showStatusModal.value = true;
    } catch (error) {
      console.error('Booking error:', error);
      bookingError.value = 'Failed to book appointment. Please try again.';
      showModal.value = false;
      bookingStatus.value = 'error';
      showStatusModal.value = true;
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-sage-50 pt-24">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-serif text-sage-800 mb-8 text-center">
            Book Your Appointment
          </h1>
          
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="space-y-6">
              <ContactForm
                name={name.value}
                email={email.value}
                phone={phone.value}
                onNameChange$={(value) => name.value = value}
                onEmailChange$={(value) => email.value = value}
                onPhoneChange$={(value) => phone.value = value}
              />

              <ServiceSelector
                services={servicesSignal.value}
                selectedServices={selectedServices.value}
                totalDuration={totalDuration.value}
                onToggleService$={(serviceId) => {
                  if (selectedServices.value.includes(serviceId)) {
                    const newServices = [...selectedServices.value];
                    selectedServices.value = newServices.filter(id => id !== serviceId);
                  } else {
                    selectedServices.value = [...selectedServices.value, serviceId];
                  }
                }}
              />

              {selectedServices.value.length > 0 && (
                <DateSelector
                  selectedDate={selectedDate.value}
                  onDateChange$={(date) => {
                    if (date !== selectedDate.value) {
                      selectedSlot.value = null;
                      selectedTechnician.value = null;
                      void fetchAvailableSlots(date);
                    }
                  }}
                />
              )}

              {selectedServices.value.length > 0 && availableSlots.value.length > 0 && (
                <TimeSlots
                  availableSlots={availableSlots.value}
                  selectedSlot={selectedSlot.value}
                  selectedTechnician={selectedTechnician.value}
                  onSlotSelect$={(slot, technician) => {
                    if (slot.status === 'busy') return;
                    
                    if (selectedSlot.value?.start === slot.start && selectedTechnician.value?.id === technician.id) {
                      selectedSlot.value = null;
                      selectedTechnician.value = null;
                      return;
                    }
                    
                    selectedSlot.value = {
                      start: slot.start,
                      end: slot.end
                    };
                    selectedTechnician.value = technician;
                  }}
                />
              )}

              {selectedSlot.value && selectedTechnician.value && (
                <AppointmentSummary
                  selectedDate={selectedDate.value}
                  selectedSlot={selectedSlot.value}
                  selectedTechnician={selectedTechnician.value}
                  selectedServices={selectedServices.value}
                  services={servicesSignal.value}
                />
              )}

              <button
                type="button"
                disabled={!selectedSlot.value || !selectedTechnician.value || isSubmitting.value}
                class={`w-full py-3 rounded-full transition-colors ${
                  selectedSlot.value && selectedTechnician.value && !isSubmitting.value
                    ? 'bg-[#8b9687] text-cream hover:bg-[#8b9687]/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick$={handleSubmit}
              >
                {isSubmitting.value ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
          
          {showModal.value && formState.value && (
            <ConfirmationPanel
              isOpen={showModal.value}
              onClose$={$(() => {
                showModal.value = false;
                bookingError.value = undefined;
              })}
              onConfirm$={handleConfirmBooking}
              isSubmitting={isSubmitting.value}
              selectedDate={formState.value.date}
              selectedSlot={formState.value.slot!}
              selectedTechnician={formState.value.technician!}
              selectedServices={formState.value.services}
              services={servicesSignal.value}
              error={bookingError.value}
            />
          )}
          
          <StatusModal
            isOpen={showStatusModal.value}
            status={bookingStatus.value}
            message={bookingError.value}
            onClose$={$(() => {
              showStatusModal.value = false;
              if (bookingStatus.value === 'success') {
                location.assign('/');
              }
            })}
          />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Book Appointment - Aesthetic Lab',
  meta: [
    {
      name: 'description',
      content: 'Book your appointment at Aesthetic Lab for beauty and wellness services',
    },
  ],
};