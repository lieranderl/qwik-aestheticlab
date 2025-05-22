import {
  $,
  component$,
  Resource,
  useComputed$,
  useOnDocument,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, routeAction$, server$ } from "@builder.io/qwik-city";
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
import { StatusModal } from "~/components/booking/status-modal";
import { TotalSummary } from "~/components/booking/total-summary";
import { WarningForm } from "~/components/booking/form-warning";
import { ga } from "~/consts";
import {
  useAuthUser,
  useRemoveBooking,
  useSupabaseSignOut,
  useAdminsLoader,
} from "./layout";
import { HiHomeOutline, HiUserOutline } from "@qwikest/icons/heroicons";
import { UpcomingAppointment } from "~/components/booking/upcoming-appoint";
import { inlineTranslate, localizePath, useSpeakLocale } from "qwik-speak";
import { ChangeLocale } from "~/components/change-locale";
import type { Booking } from "~/types";
import { supabaseBrowser } from "~/shared/supabase-client";
const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Server call to fetch available time slots */
const fetchTechnicianSlots = server$(
  async (api_base_url, api_token, tech, date, weekday, duration) => {
    const url = `${api_base_url}/calendar/technician/${tech.id}?date=${date}&weekday=${weekday}&slot_duration=${duration}`;
    const response = await fetch(url, {
      headers: { Authorization: `${api_token}` },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slots: TimeSlot[] = await response.json();
    return !slots.length || slots.every((s) => Object.keys(s).length === 0)
      ? null
      : { tech, slots };
  },
);

/** Booking appointment submission */
export const useBookAppointment = routeAction$(async (form, { env }) => {
  const res = await fetch(
    `${env.get("API_BASE_URL")}/calendar/technician/${form.selectedTechId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${env.get("API_TOKEN")}`,
      },
      body: JSON.stringify({
        service_id: Object.keys(form.services),
        date: form.slotStart,
        weekday: form.weekday,
        user_email: form.email,
        name: form.name,
        phone: form.phone,
      }),
    },
  );
  await res.json();
  return { success: res.ok };
});

export default component$(() => {
  /** Init */
  useOnDocument(
    "DOMContentLoaded",
    $(() => import("cally")),
  );

  /** Localization and routing */
  const locale = useSpeakLocale();
  const getPath = localizePath();
  const pathtohome = getPath("/", locale.lang);
  const t = inlineTranslate();

  /** Loaders */
  const servicesSignal = useServicesLoader();
  const techniciansSignal = useTechniciansLoader();
  const envs = useEnvLoader();
  const useUser = useAuthUser();
  const useAdmin = useAdminsLoader();
  const signOut = useSupabaseSignOut();

  /** Signals */
  const nameSignal = useSignal(useUser.value.user_metadata.name ?? "");
  const emailSignal = useSignal(useUser.value.email ?? "");
  const phoneSignal = useSignal(useUser.value.user_metadata.phone ?? "");
  const changeEmailByAdmin = useSignal("");
  const selectedServices = useSignal<string[]>([]);
  const selectedDateSignal = useSignal("Pick a date");
  const selectedSlot = useSignal<TimeSlot | null>(null);
  const selectedTechnician = useSignal<Technician | null>(null);
  const showConfirmationPanelSignal = useSignal(false);

  /** Computed */
  const isAdminSignal = useComputed$(() =>
    useAdmin.value.some(
      (admin) => admin.email === useUser.value.email && admin.active,
    ),
  );
  const selectedServicesNames = useComputed$(() =>
    servicesSignal.value
      .filter((s) => selectedServices.value.includes(s.id))
      .map((s) => s.name),
  );
  const totalDuration = useComputed$(() =>
    selectedServices.value.reduce(
      (total, id) =>
        total + (servicesSignal.value.find((s) => s.id === id)?.duration || 0),
      0,
    ),
  );
  const totalPrice = useComputed$(() =>
    selectedServices.value.reduce(
      (total, id) =>
        total + (servicesSignal.value.find((s) => s.id === id)?.price || 0),
      0,
    ),
  );
  const selectedWeekDay = useComputed$(
    () => WEEKDAYS[new Date(selectedDateSignal.value).getDay()],
  );
  const IsValidFormSignal = useComputed$(
    () =>
      /^[\s\S]{2,50}$/.test(nameSignal.value) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSignal.value) &&
      /^\+?[0-9\-\s]{9,15}$/.test(phoneSignal.value) &&
      selectedServices.value.length > 0 &&
      selectedDateSignal.value !== "Pick a date" &&
      selectedSlot.value !== null,
  );


  const handleBookButtonClick = $(() => {
    setTimeout(() => {
      showConfirmationPanelSignal.value = true;
    }, 200);
  });
  const getEligibleTechnicians = $(() =>
    techniciansSignal.value.filter((tech) =>
      selectedServices.value.every((id) => tech.services.includes(id)),
    ),
  );

  /** Actions */
  const action = useBookAppointment();
  const useRemoveBookingAction = useRemoveBooking();

  /** Resources */
  const scheduledAppointmentsResource = useResource$<Booking[]>(
    async ({ track }) => {
      track(() => changeEmailByAdmin.value);
      track(() => useRemoveBookingAction.value?.success);
      console.log("changeEmailByAdmin.value:", changeEmailByAdmin.value);
      console.log("useUser.value.email:", useUser.value.email);
      if (useUser.value.email === "") return [];
      const email = changeEmailByAdmin.value
        ? changeEmailByAdmin.value
        : useUser.value.email;

      const { data: clientData, error: clientError } = await supabaseBrowser
        .from("clients")
        .select("*")
        .eq("email", email)
        .single();
      if (clientError || !clientData) {
        nameSignal.value = "";
        phoneSignal.value = "";
        return [];
      }

      //update user data
      nameSignal.value = clientData.name;
      phoneSignal.value = clientData.phone;

      const { data: bookingsData, error: bookingsError } = await supabaseBrowser
        .from("bookings")
        .select("*")
        .eq("client_id", clientData.id)
        .gt("datetime", new Date().toISOString())
        .order("datetime", { ascending: true });
      if (bookingsError) return [];

      const technicianIds = bookingsData.map((b) => b.technician_id);
      const { data: techniciansData } = await supabaseBrowser
        .from("technicians")
        .select("id, name")
        .in("id", technicianIds);

      const techMap = new Map(techniciansData?.map(t => [t.id, t.name]));

      return await Promise.all(
        bookingsData.map(async (booking) => {
          const services = await supabaseBrowser
            .from("services")
            .select("name,name_ru,name_nl,name_fr")
            .in("id", booking.services);

          const s = services.data || [];
          const lang = locale.lang.split("-")[0];

          return {
            ...booking,
            services_names: s.map((service) =>
              lang === "ru"
                ? service.name_ru
                : lang === "nl"
                  ? service.name_nl
                  : lang === "fr"
                    ? service.name_fr
                    : service.name,
            ),
            technician_name: techMap.get(booking.technician_id) || ""
          };
        })
      );
    },
  );

  const useAvailableSlots = useResource$(async ({ track }) => {
    track(() => selectedServices.value.length + selectedDateSignal.value);
    selectedSlot.value = null;
    selectedTechnician.value = null;
    if (
      selectedDateSignal.value !== "Pick a date" &&
      selectedServices.value.length > 0
    ) {
      const results = await Promise.all(
        (await getEligibleTechnicians()).map((tech) =>
          fetchTechnicianSlots(
            envs.value.API_BASE_URL,
            envs.value.API_TOKEN,
            tech,
            selectedDateSignal.value,
            selectedWeekDay.value,
            totalDuration.value,
          ).catch((e) => console.error(e)),
        ),
      );
      return results.filter(
        (r) => r && r.slots.length > 0,
      ) as TechnicianSlots[];
    }
    return [];
  });

  /** UI */
  return (
    <div class="min-h-screen bg-base-200 py-12">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <a href={pathtohome} class="link">
            <HiHomeOutline class="text-xl md:text-3xl text-primary" />
          </a>

          {isAdminSignal.value && (
            <div class="flex items-center">
              <HiUserOutline class="text-xl md:text-3xl text-error me-2" />
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-error">
                  {useUser.value.user_metadata.name}
                </span>
                <span class="text-xs text-gray-500">{useUser.value.email}</span>
              </div>
            </div>
          )}

          <ChangeLocale />
        </div>
        <div class="card mx-auto bg-base-100 shadow-sm">
          <div class="card-body p-4 md:p-8">
            <Resource
              value={scheduledAppointmentsResource}
              onResolved={(data) => (
                <UpcomingAppointment
                  upcomingAppointments={data}
                  useRemoveBookingAction={useRemoveBookingAction}
                />
              )}
            />
            <div class="text-primary text-center text-xl md:text-4xl font-qestero font-semibold mb-4">
              {t("app.book.book_new_app@@Book New Appointment")}
            </div>
            <Form
              class="space-y-4 flex flex-col justify-center"
              action={action}
            >
              <ContactFormInputs
                nameSignal={nameSignal}
                emailSignal={emailSignal}
                phoneSignal={phoneSignal}
                signOut={signOut}
                isAdmin={isAdminSignal.value}
                changeEmailByAdmin={changeEmailByAdmin}
              />
              <ServiceSelector
                selectedServices={selectedServices}
                services={servicesSignal.value}
                totalDuration={totalDuration.value}
                totalPrice={totalPrice.value}
              />
              <div class="w-1 content-center" style="anchor-name:--cally1" />
              {selectedServices.value.length > 0 && (
                <DateSelector selectedDateSignal={selectedDateSignal} />
              )}
              <input name="weekday" hidden value={selectedWeekDay.value} />
              <Resource
                value={useAvailableSlots}
                onPending={() => (
                  <span class="loading loading-dots loading-lg text-primary" />
                )}
                onResolved={(availableSlots) => (
                  <TimeSlots
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    selectedTechnician={selectedTechnician}
                  />
                )}
              />
              <TotalSummary
                selectedServicesNames={selectedServicesNames.value}
                selectedServices={selectedServices.value}
                totalDuration={totalDuration.value}
                totalPrice={totalPrice.value}
              />
              <WarningForm
                name={nameSignal.value}
                phone={phoneSignal.value}
                email={emailSignal.value}
                selectedTechnician={selectedTechnician.value}
              />
              <button
                type="button"
                class="btn btn-secondary btn-lg"
                onClick$={handleBookButtonClick}
                disabled={!IsValidFormSignal.value}
              >
                {t("app.book.book_app@@Book Appointment")}
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

export const head: DocumentHead = {
  title: "Aesthetic Lab - Booking",
  meta: [
    {
      name: "description",
      content:
        "Book now! Looking for expert nails and manicure in Leuven? Visit Aesthetic Lab for top-tier beauty & nail care.",
    },
  ],
  scripts: ga,
};
