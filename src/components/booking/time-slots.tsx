import { component$, $ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { useFormatDate } from "qwik-speak";

import type { Technician, TechnicianSlots, TimeSlot } from "~/types";
import ImgRubina from "~/media/rubina.jpg?jsx";
import ImgZara from "~/media/zara.jpg?jsx";

export interface TimeSlotsProps {
	availableSlots: TechnicianSlots[];
	selectedSlot: Signal<TimeSlot | null>;
	selectedTechnician: Signal<Technician | null>;
}

const technicianImages: Record<string, typeof ImgRubina> = {
	rubina: ImgRubina,
	zara: ImgZara,
};

export default component$<TimeSlotsProps>(
	({ availableSlots, selectedSlot, selectedTechnician }) => {
		const ft = useFormatDate();

		const onSlotSelect$ = $((slot: TimeSlot, technician: Technician) => {
			if (slot.status === "busy") return;

			const isSameSlot =
				selectedSlot.value?.start === slot.start &&
				selectedTechnician.value?.id === technician.id;

			if (isSameSlot) {
				selectedSlot.value = null;
				selectedTechnician.value = null;
			} else {
				selectedSlot.value = { ...slot };
				selectedTechnician.value = technician;
			}
		});

		return (
			<div class="space-y-6">
				{availableSlots.map(({ tech, slots }) => {
					const TechImage = technicianImages[tech.photo_url] || null;
					return (
						<div key={tech.id} class="card border-1 border-base-200 shadow-sm">
							<div class="card-body">
								<div class="flex items-center gap-4 mb-4">
									<div class="avatar">
										<div class="w-12 rounded-full">
											{TechImage && <TechImage />}
										</div>
									</div>
									<div>
										<h3 class="font-medium">{tech.name}</h3>
										<p class="font-inter capitalize badge badge-sm badge-soft badge-secondary">
											{tech.role || "Technician"}
										</p>
									</div>
								</div>

								<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
									{slots.map((slot) =>
										slot.status !== "busy" ? (
											<button
												key={slot.start}
												type="button"
												onClick$={() => onSlotSelect$(slot, tech)}
												class={[
													"btn btn-secondary",
													selectedSlot.value?.start === slot.start &&
													selectedTechnician.value?.id === tech.id
														? ""
														: "btn-soft",
												].join(" ")}
											>
												{ft(slot.start, { timeStyle: "short" })}
											</button>
										) : null,
									)}
								</div>
							</div>
						</div>
					);
				})}

				<input
					name="slotStart"
					hidden
					value={selectedSlot.value?.start || ""}
				/>
				<input
					name="selectedTechId"
					hidden
					value={selectedTechnician.value?.id || ""}
				/>
			</div>
		);
	},
);
