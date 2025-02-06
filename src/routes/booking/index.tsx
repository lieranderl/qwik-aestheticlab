import {
  $,
  component$,
  Resource,
  useComputed$,
  useOnDocument,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { Form, routeAction$, server$, validator$ } from "@builder.io/qwik-city";

import type { Technician, TechnicianSlots, TimeSlot } from "~/types";
import {
  useServicesLoader,
  useTechniciansLoader,
  useEnvLoader,
} from "../layout";
import { ConfirmationSidePanel } from "~/components/booking/confirmation-side-panel";
import { ContactFormInputs } from "~/components/booking/contact-form-inputs";
import { ServiceSelector } from "~/components/booking/service-selector";
import { DateSelector } from "~/components/booking/date-selector";
import TimeSlots from "~/components/booking/time-slots";
import StatusModal from "~/components/booking/status-modal";
import { TotalSummary } from "~/components/booking/total-summary";

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const fetchTechnicianSlots = server$(
  async (
    api_base_url: string,
    tech: Technician,
    date: string,
    weekday: string,
    duration: number
  ) => {
    const url = `${api_base_url}/calendar/technician/${tech.id}?date=${date}&weekday=${weekday}&slot_duration=${duration}`;
    console.log(`Sending request to: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const slots: TimeSlot[] = await response.json();

    if (
      !Array.isArray(slots) ||
      slots.length === 0 ||
      slots.every((slot) => Object.keys(slot).length === 0)
    ) {
      return null;
    }

    return {
      tech: tech,
      slots: slots,
    } as TechnicianSlots;
  }
);

export const useBookAppointment = routeAction$(
  async (form, { fail, env }) => {
    console.log("ACTION");
    console.log(form);
    console.log(fail);
    const API_BASE_URL = env.get("API_BASE_URL");
    console.log(
      `Sending request to: ${API_BASE_URL}/calendar/technician/${form.selectedTechId}`
    );
    const response = await fetch(
      `${API_BASE_URL}/calendar/technician/${form.selectedTechId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: Object.keys(form.services),
          date: form.slotStart,
          weekday: form.weekday,
          user_email: form.email,
          name: form.name,
          phone: form.phone,
        }),
      }
    );

    await response.json();
    if (!response.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  },
  validator$(async (e, form) => {
    console.log("VALIDATOR");
	console.log(form)
    return {
      success: false,
        error: {
          message: "secret is not correct",
        },
    };
  })
);

export default component$(() => {
  useOnDocument(
    "DOMContentLoaded",
    $(async () => {
      await import("cally");
    })
  );

  const servicesSignal = useServicesLoader();
  const techniciansSignal = useTechniciansLoader();
  const envs = useEnvLoader();

  const nameSignal = useSignal("");
  const emailSignal = useSignal("");
  const phoneSignal = useSignal("");
  const selectedServices = useSignal<string[]>([]);
  const selectedServicesNames = useComputed$(() => {
    return servicesSignal.value
      .filter((service) => selectedServices.value.includes(service.id))
      .map((service) => service.name);
  });
  const totalDuration = useComputed$(() => {
    return selectedServices.value.reduce((total, serviceId) => {
      const service = servicesSignal.value.find((s) => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  });

  const totalPrice = useComputed$(() => {
    return selectedServices.value.reduce((total, serviceId) => {
      const service = servicesSignal.value.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  });

  const selectedDateSignal = useSignal("Pick a date");
  const selectedWeekDay = useComputed$(() => {
    const dayIndex = new Date(selectedDateSignal.value).getDay();
    return WEEKDAYS[dayIndex];
  });

  const selectedSlot = useSignal<TimeSlot | null>(null);
  const selectedTechnician = useSignal<Technician | null>(null);

  const IsValidFormSignal = useComputed$(() => {
    const nameValid = /^[a-zA-Z\s]{2,50}$/.test(nameSignal.value);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSignal.value);
    const phoneValid = /^\+?[0-9\-\s]{9,15}$/.test(phoneSignal.value);
    return true;
    // return (
    // 	nameValid &&
    // 	emailValid &&
    // 	phoneValid &&
    // 	selectedServices.value.length > 0 &&
    // 	selectedDateSignal.value !== "Pick a date" &&
    // 	selectedSlot.value !== null
    // );
  });

  const showConfirmationPanelSignal = useSignal(false);
  const action = useBookAppointment();

  const handleBookButtonClick = $(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    showConfirmationPanelSignal.value = true;
  });

  const getEligibleTechnicians = $(() => {
    return techniciansSignal.value.filter((tech: Technician) =>
      selectedServices.value.every((serviceId) =>
        tech.services.includes(serviceId)
      )
    );
  });

  const fetchAvailableSlots = $(async () => {
    const eligibleTechnicians = await getEligibleTechnicians();
    try {
      const slotsPromises = eligibleTechnicians.map(
        async (tech: Technician) => {
          return await fetchTechnicianSlots(
            envs.value.API_BASE_URL,
            tech,
            selectedDateSignal.value,
            selectedWeekDay.value,
            totalDuration.value
          );
        }
      );
      const results = await Promise.all(
        slotsPromises.map((p) =>
          p.catch((error) => {
            console.error("Error fetching slots for technician:", error);
            return null;
          })
        )
      );
      return results.filter(
        (result) =>
          result !== null &&
          result.slots.length > 0 &&
          result.slots.some((slot) => Object.keys(slot).length > 0)
      ) as TechnicianSlots[];
    } catch (error) {
      console.error("Error fetching slots:", error);
      return [] as TechnicianSlots[];
    }
  });

  const useAvailableSlots = useResource$(async ({ track }) => {
    track(
      () => selectedServices.value.length.toString() + selectedDateSignal.value
    );
    selectedSlot.value = null;
    selectedTechnician.value = null;
    if (
      selectedDateSignal.value !== "Pick a date" &&
      selectedServices.value.length > 0
    ) {
      return await fetchAvailableSlots();
    }
    return [];
  });

  return (
    <div class="min-h-screen bg-base-200 py-24">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-5xl mb-8 text-center font-qestero font-semibold">
          Book Your Appointment
        </h1>
        <div class="card max-w-2xl mx-auto bg-base-100 shadow-sm">
          <div class="card-body">
            <Form
              class="space-y-6 flex flex-col justify-center"
              action={action}
            >
              <ContactFormInputs
                nameSignal={nameSignal}
                emailSignal={emailSignal}
                phoneSignal={phoneSignal}
                showConfirmationPanel={showConfirmationPanelSignal.value}
              />
              <div class="w-1 content-center" style="anchor-name:--cally1" />
              <ServiceSelector
                selectedServices={selectedServices}
                services={servicesSignal.value}
                totalDuration={totalDuration.value}
                totalPrice={totalPrice.value}
              />

              {selectedServices.value.length > 0 && (
                <DateSelector selectedDateSignal={selectedDateSignal} />
              )}

              <input name="weekday" hidden value={selectedWeekDay.value} />

              <Resource
                value={useAvailableSlots}
                onPending={() => (
                  <span class="loading loading-dots loading-lg text-primary" />
                )}
                onResolved={(availableSlots) => {
                  return (
                    <TimeSlots
                      availableSlots={availableSlots}
                      selectedSlot={selectedSlot}
                      selectedTechnician={selectedTechnician}
                    />
                  );
                }}
              />

              <TotalSummary
                selectedServices={selectedServices.value}
                totalDuration={totalDuration.value}
                totalPrice={totalPrice.value}
              />

              <button
                type="button"
                class="btn btn-secondary btn-lg"
                onClick$={handleBookButtonClick}
                disabled={!IsValidFormSignal.value}
              >
                Book Appointment
              </button>

              <ConfirmationSidePanel
                isOpen={showConfirmationPanelSignal}
                isValid={IsValidFormSignal.value}
                isSubmitting={action.isRunning}
                selectedServicesNames={selectedServicesNames.value}
                selectedSlot={selectedSlot.value}
                selectedTechnician={selectedTechnician.value}
                duration={totalDuration.value}
                price={totalPrice.value}
              />
            </Form>
          </div>
        </div>
        <StatusModal action={action} />
      </div>
    </div>
  );
});
