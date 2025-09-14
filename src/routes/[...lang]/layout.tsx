import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "~/shared/supabase-client";
import type { Contact, Service, ServiceCategory, Technician } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export const useContactLoader = routeLoader$<Contact | null>(async (event) => {
  console.log("Fetching contact info from Supabase…");

  const client = supabase(event);

  const { data, error } = await client
    .from("contacts") 
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching contact:", error);
    return null;
  }

  return data as Contact;
});

export const useServicesCategoryLoader = routeLoader$(async (requestEv) => {
  console.log("Fetching categories from Supabase");

  const client = supabase(requestEv);
  const { data, error } = await client
    .from("category_service")
    .select("*")
    .order("priority", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  if (!data) {
    return [];
  }

  const locale = requestEv.locale().split("-")[0];
  const shortlang = locale === "en" ? "en" : locale;

  return data.map((category) => ({
    id: category.id,
    priority: category.priority,
    name:
      shortlang === "ru"
        ? category.name_ru
        : shortlang === "nl"
          ? category.name_nl
          : shortlang === "fr"
            ? category.name_fr
            : shortlang === "uk"
              ? category.name_uk
              : category.name,
  })) as ServiceCategory[];
});

export const useTechniciansLoader = routeLoader$<Technician[]>(
  async (requestEv) => {
    console.log("Fetching technicians from Supabase");

    const client = supabase(requestEv);
    const { data, error } = await client
      .from("technicians")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Error fetching technicians:", error);
      return [];
    }
    return data ?? [];
  }
);

export const useServicesLoader = routeLoader$(async (requestEv) => {
  console.log("Fetching services from Supabase");

  const client = supabase(requestEv);
  const { data, error } = await client
    .from("services")
    .select("*")
    .eq("active", true)
    .order("priority", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  if (!data) return [];

  // set name & description based on locale
  const shortlocal = requestEv.locale().split("-")[0];

  const localizedServices = data.map((service) => {
    const localizedName =
      shortlocal === "ru"
        ? service.name_ru
        : shortlocal === "nl"
          ? service.name_nl
          : shortlocal === "fr"
            ? service.name_fr
            : shortlocal === "uk"
              ? service.name_uk
              : service.name;

    const localizedDescription =
      shortlocal === "ru"
        ? service.description_ru
        : shortlocal === "nl"
          ? service.description_nl
          : shortlocal === "fr"
            ? service.description_fr
            : shortlocal === "uk"
              ? service.description_uk
              : service.description;

    return {
      id: service.id,
      name: localizedName,
      description: localizedDescription,
      duration: service.duration,
      price: service.price,
      created_at: service.created_at,
      priority: service.priority,
      category_id: service.category_id,
    };
  });

  return localizedServices as Service[];
});

export default component$(() => {
  return (
    <main>
      <Slot />
    </main>
  );
});
