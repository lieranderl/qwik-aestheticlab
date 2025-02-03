import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { Form, routeAction$, server$ } from "@builder.io/qwik-city";

import type { Technician, TimeSlot } from "~/types";
import {
  useServicesLoader,
  useTechniciansLoader,
  useEnvLoader,
} from "../layout";
import { ConfirmationSidePanel } from "~/components/booking2/confirmation-side-panel";
import { ContactFormInputs } from "~/components/booking2/contact-form-inputs";
import { ServiceSelector } from "~/components/booking2/service-selector";

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
      technician: tech,
      slots: slots.map((slot) => ({
        start: slot.start,
        end: slot.end,
        status: slot.status,
      })),
    };
  }
);

export const useBookAppointment = routeAction$(async () => {
  console.log("ACTION");
});

export default component$(() => {
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

  const IsValidFormSignal = useComputed$(() => {
    const nameValid = /^[a-zA-Z\s]{2,50}$/.test(nameSignal.value);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSignal.value);
    const phoneValid = /^\+?[0-9\-\s]{10,15}$/.test(phoneSignal.value);
    return nameValid && emailValid && phoneValid;
  });

  const showConfirmationPanelSignal = useSignal(false);
  const action = useBookAppointment();

  //   console.log(action)

  const handleBookButtonClick = $(() => {
    showConfirmationPanelSignal.value = IsValidFormSignal.value;
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
              <ServiceSelector
                selectedServices={selectedServices}
                services={servicesSignal.value}
                totalDuration={totalDuration.value}
              />
              {/* <button type="submit" class="btn ">Book Appointment</button> */}
              <button
                type="button"
                class="btn"
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
