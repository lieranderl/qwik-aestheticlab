import {
  $,
  component$,
  useComputed$,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";
import { Form, routeAction$, server$, ServerQRL } from "@builder.io/qwik-city";

import type { Technician, TimeSlot } from "~/types";
import {
  useServicesLoader,
  useTechniciansLoader,
  useEnvLoader,
} from "../layout";
import { ConfirmationSidePanel } from "~/components/booking2/confirmation-side-panel";
import { ContactFormInputs } from "~/components/booking2/contact-form-inputs";
import { ServiceSelector } from "~/components/booking2/service-selector";
import { DateSelector } from "~/components/booking2/date-selector";

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
      tech_id: tech.id,
      slots: slots,
    };
  }
);

export const useBookAppointment = routeAction$(async (form) => {
  console.log("ACTION");
  console.log(form);
});

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

  const nameSignal = useSignal("tttt");
  const emailSignal = useSignal("tt@tt.er");
  const phoneSignal = useSignal("456789765456");
  const selectedServices = useSignal<string[]>([]);
  const totalDuration = useComputed$(() => {
    return selectedServices.value.reduce((total, serviceId) => {
      const service = servicesSignal.value.find((s) => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  });
  const selectedDateSignal = useSignal("Pick a date");
  const availableSlots = useSignal<{ tech_id: string; slots: TimeSlot }[]>([]);
  const selectedSlot = useSignal<TimeSlot>();

  const IsValidFormSignal = useComputed$(() => {
    const nameValid = /^[a-zA-Z\s]{2,50}$/.test(nameSignal.value);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSignal.value);
    const phoneValid = /^\+?[0-9\-\s]{10,15}$/.test(phoneSignal.value);
    return (
      nameValid &&
      emailValid &&
      phoneValid &&
      selectedServices.value.length > 0 &&
      selectedDateSignal.value !== "Pick a date"
    );
  });

  const showConfirmationPanelSignal = useSignal(false);
  const action = useBookAppointment();

  const handleBookButtonClick = $(() => {
    showConfirmationPanelSignal.value = IsValidFormSignal.value;
  });

  const getWeekday = $(async (date: string) => {
    const dayIndex = new Date(date).getDay();
    return WEEKDAYS[dayIndex];
  });

  const getEligibleTechnicians = $(() => {
    return techniciansSignal.value.filter((tech: Technician) =>
      selectedServices.value.every((serviceId) =>
        tech.services.includes(serviceId)
      )
    );
  });

  const fetchAvailableSlots = $(async (date: string) => {
    const eligibleTechnicians = await getEligibleTechnicians();
    const weekday = await getWeekday(date);

    try {
      const slotsPromises = eligibleTechnicians.map(
        async (tech: Technician) => {
          return await fetchTechnicianSlots(
            envs.value.API_BASE_URL,
            tech,
            date,
            weekday,
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

      availableSlots.value = results.filter(
        (result) =>
          result !== null &&
          result.slots.length > 0 &&
          result.slots.some((slot) => Object.keys(slot).length > 0)
      );
    } catch (error) {
      console.error("Error fetching slots:", error);
      availableSlots.value = [];
    }
  });

  return (
    <div class="min-h-screen bg-base-200 pt-24">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl mb-8 text-center font-qestero font-normal">
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
                showConfirmationPanelSignal={showConfirmationPanelSignal}
              />
              <div class="w-1 content-center" style="anchor-name:--cally1" />
              <ServiceSelector
                selectedServices={selectedServices}
                services={servicesSignal.value}
                totalDuration={totalDuration.value}
                showConfirmationPanelSignal={showConfirmationPanelSignal}
              />

              {selectedServices.value.length > 0 && (
                <DateSelector selectedDateSignal={selectedDateSignal} />
              )}

              {selectedServices.value.length > 0 &&
                selectedDateSignal.value !== "Pick a date" && (
                  <div>Time slots</div>
                )}

              {/* <button type="submit" class="btn ">Book Appointment</button> */}
              <button
                type="button"
                class="btn btn-lg"
                onClick$={handleBookButtonClick}
                disabled={!IsValidFormSignal.value}
              >
                Book Appointment
              </button>

              <ConfirmationSidePanel isOpen={showConfirmationPanelSignal} />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
});
