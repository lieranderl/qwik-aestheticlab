import type { Signal } from "@builder.io/qwik";
import { useClickOutside } from "@ditadi/qwik-hooks";
import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import {
  HiCheckCircleOutline,
  HiXCircleOutline,
} from "@qwikest/icons/heroicons";
import { formatDate, formatPrice, formatTime } from "~/consts";
import type { Technician, TimeSlot } from "~/types";

export interface ConfirmationPanelProps {
  isOpen: Signal<boolean>;
  isValid: boolean;
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
    isValid,
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


    const ref = useSignal<HTMLDivElement>();

    useClickOutside(
      ref,
      $(() => {
        if (isOpen.value) {
          isOpen.value = false;
        }
      })
    );

    const modalSig = useSignal<HTMLDialogElement | null>(null);

    useOnDocument('DOMContentLoaded', $(()=>{
      modalSig.value = document.getElementById("confirmation_modal") as HTMLDialogElement
    }))

    return (
      <div
        ref={ref}
        class={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out z-50  ${
          isOpen.value ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div class="flex flex-col h-full">
          <div class="p-6 border-b border-gray-300 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-primary">
              Confirm Your Booking
            </h2>
            <button
              type="button"
              onClick$={onClose$}
              class="btn btn-ghost btn-sm text-error"
              disabled={isSubmitting}
            >
              <HiXCircleOutline class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <div class="card bg-base-200 shadow-sm p-4">
              <h3 class="text-lg font-semibold font-sans mb-1">
                Appointment Details
              </h3>
              <p class="text-sm ms-2 mb-1">
                {selectedSlot?.start && selectedSlot?.end ? (
                  <>
                    <span class="font-semibold">
                      {formatDate(selectedSlot.start)}
                    </span>
                    <br />
                    from{" "}
                    <span class="font-semibold">
                      {formatTime(selectedSlot.start)}
                    </span>{" "}
                    to{" "}
                    <span class="font-semibold">
                      {formatTime(selectedSlot.end)}
                    </span>
                  </>
                ) : (
                  "N/A"
                )}
              </p>
              <p class="text-sm ms-2">
                Total Duration: <span class="font-semibold">{duration}</span>{" "}
                minutes
              </p>
            </div>

            <div class="card bg-base-200 shadow-sm p-4">
              <h3 class="text-lg font-semibold font-sans mb-1">Services</h3>
              <ul class="list-disc list-inside ms-2">
                {selectedServicesNames.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <div class="card bg-base-200 shadow-sm p-4">
              <h3 class="text-lg font-semibold font-sans mb-1">Specialist</h3>
              <p class="font-semibold ms-2">{selectedTechnician?.name}</p>
              <p class="text-sm font-inter ms-2">{selectedTechnician?.role}</p>
            </div>

            <div class="card bg-base-200 shadow-sm p-4">
              <h3 class="text-lg font-semibold font-sans mb-1">Total Price</h3>
              <p class="text-xl font-semibold ms-2">{formatPrice(price)}</p>
            </div>
          </div>

          <div class="p-6 card">
            <div class="flex gap-3">
              <button
                type="button"
                onClick$={onClose$}
                class="btn btn-outline btn-error"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-success"
                disabled={isSubmitting || !isValid}
                onClick$={() => {
                  modalSig.value?.showModal();
                  isOpen.value = false;
                }}
              >
                <HiCheckCircleOutline class="w-5 h-5" /> Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
