import type { Signal } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import type { Technician, TimeSlot } from "~/types";

export interface ConfirmationPanelProps {
  isOpen: Signal<boolean>;
  isSubmitting: boolean;
  selectedSlot: TimeSlot | null;
  selectedTechnician: Technician | null;
  selectedServicesNames: string[];
  duration: number;
  price: number;
}

export const ConfirmationSidePanel = component$<ConfirmationPanelProps>(
  ({
    isOpen,
    isSubmitting,
    selectedSlot,
    selectedServicesNames,
    selectedTechnician,
    duration,
    price,
  }) => {
    const onClose$ = $(() => {
      isOpen.value = false;
    });

    return (
      <div
        class={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen.value ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {selectedSlot?.start} - {selectedSlot?.end}
          {duration}
          {price}
          {selectedServicesNames.join(" ")}
          {selectedTechnician?.name}
          {selectedTechnician?.role}
        </div>

        <div class="mt-auto p-6 ">
          <div class="flex gap-3">
            <button
              type="button"
              onClick$={onClose$}
              class="btn "
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" class="btn ">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }
);
