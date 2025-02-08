import type { Signal } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import type { Technician } from "~/types";
import type { TechnicianSlots, TimeSlot } from "~/types";
import ImgRubina from "~/media/rubina.jpg?jsx";
import ImgZara from "~/media/zara.jpg?jsx";
export interface TimeSlotsProps {
  availableSlots: TechnicianSlots[];
  selectedSlot: Signal<TimeSlot | null>;
  selectedTechnician: Signal<Technician | null>;
}

export default component$<TimeSlotsProps>(
  ({ availableSlots, selectedSlot, selectedTechnician }) => {
    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const onSlotSelect$ = $((slot: TimeSlot, technician: Technician) => {
      if (slot.status === "busy") return;

      if (
        selectedSlot.value?.start === slot.start &&
        selectedTechnician.value?.id === technician.id
      ) {
        selectedSlot.value = null;
        selectedTechnician.value = null;
        return;
      }

      selectedSlot.value = {
        start: slot.start,
        end: slot.end,
        status: slot.status,
      };
      selectedTechnician.value = technician;
    });

    return (
      <div class="space-y-6">
        {availableSlots.map((techSlots) => (
          <div
            key={techSlots.tech.id}
            class="card border-1 border-base-200 shadow-sm"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    {techSlots.tech.photo_url === "rubina" && <ImgRubina />}
                    {techSlots.tech.photo_url === "zara" && <ImgZara />}
                  </div>
                </div>
                <div>
                  <h3 class="font-medium">{techSlots.tech.name}</h3>
                  <p class="font-inter capitalize badge badge-sm badge-soft badge-secondary">
                    {techSlots.tech.role || "Technician"}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {techSlots.slots.map(
                  (slot) =>
                    slot.status !== "busy" && (
                      <button
                        key={slot.start}
                        type="button"
                        onClick$={() => onSlotSelect$(slot, techSlots.tech)}
                        class={`btn btn-secondary ${
                          selectedSlot.value?.start === slot.start &&
                          selectedTechnician.value?.id === techSlots.tech.id
                            ? ""
                            : "btn-soft"
                        }`}
                      >
                        {formatTime(slot.start)}
                      </button>
                    )
                )}
              </div>
            </div>

            <input name="slotStart" hidden value={selectedSlot.value?.start} />
            <input
              name="selectedTechId"
              hidden
              value={selectedTechnician.value?.id}
            />
          </div>
        ))}
      </div>
    );
  }
);
