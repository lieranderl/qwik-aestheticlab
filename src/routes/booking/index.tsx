import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Form, routeAction$, server$, validator$ } from "@builder.io/qwik-city";
import {
  HiEnvelopeOutline,
  HiUserOutline,
  HiPhoneOutline,
} from "@qwikest/icons/heroicons";
import type { Technician, TimeSlot } from "~/types";
import {
  useServicesLoader,
  useTechniciansLoader,
  useEnvLoader,
} from "../layout";
import { ConfirmationSidePanel } from "~/components/booking2/confirmation-side-panel";

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

  const name$ = useSignal("tttt");
  const email$ = useSignal("tt@tt.er");
  const phone$ = useSignal("456789765456");

  
  const IsValidForm$ = useComputed$(() => {
    const nameValid = /^[a-zA-Z\s]{2,50}$/.test(name$.value);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email$.value);
    const phoneValid = /^\+?[0-9\-\s]{10,15}$/.test(phone$.value);
    return nameValid && emailValid && phoneValid;
  });

  const showConfirmationPanel = useSignal(false);
  const action = useBookAppointment();

  //   console.log(action)

  const handleBookButtonClick = $(() => {
    showConfirmationPanel.value = IsValidForm$.value;
  });

  return (
    <div class="min-h-screen bg-base-200 pt-24">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl mb-8 text-center font-inter font-normal">
          Book Your Appointment
        </h1>
        <div class="card max-w-2xl mx-auto bg-base-100 shadow-sm">
          <div class="card-body">
            <Form
              class="space-y-6 flex flex-col justify-center"
              action={action}
            >
              <div>
                <label class="input validator w-full">
                  <HiUserOutline class="text-primary w-4 h-4" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter you name..."
                    pattern="^[a-zA-Z\s]{2,50}$"
                    required
                    bind:value={name$}
                    disabled={showConfirmationPanel.value}
                  />
                </label>
                <div class="validator-hint hidden">Please enter your name</div>
              </div>
              <div>
                <label class="input validator w-full">
                  <HiEnvelopeOutline class="text-primary w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    placeholder="mail@site.com"
                    required
                    bind:value={email$}
                    disabled={showConfirmationPanel.value}
                  />
                </label>
                <div class="validator-hint hidden">
                  Please enter valid email address
                </div>
              </div>
              <div>
                <label class="input validator w-full">
                  <HiPhoneOutline class="text-primary w-4 h-4" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number..."
                    required
                    pattern="^\+?[0-9\-\s]{10,15}$"
                    bind:value={phone$}
                    disabled={showConfirmationPanel.value}
                  />
                </label>
                <div class="validator-hint hidden">
                  Please enter valid phone number
                </div>
              </div>

              {/* <button type="submit" class="btn ">Book Appointment</button> */}
              <button
                type="button"
                class="btn"
                onClick$={handleBookButtonClick}
                disabled={!IsValidForm$.value}
              >
                Book Appointment
              </button>

              <ConfirmationSidePanel isOpen={showConfirmationPanel} />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
});
