import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import type { Service, Technician } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export const useEnvLoader = routeLoader$(({ env }) => {
  const API_BASE_URL = env.get("API_BASE_URL") || "";
  return {
    API_BASE_URL,
  };
});

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useTechniciansLoader = routeLoader$<Technician[]>(
  async ({ env }) => {
    const API_BASE_URL = env.get("API_BASE_URL");
    try {
      const response = await fetch(`${API_BASE_URL}/technicians`);
      const data: Technician[] = await response.json();
      return data.filter((technician) => technician.active);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      return [];
    }
  }
);

export const useServicesLoader = routeLoader$(async ({ env }) => {
  const API_BASE_URL = env.get("API_BASE_URL");
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    const data: Service[] = await response.json();
    return data.filter((service) => service.active).sort((a,b) => (a.priority- b.priority))
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
});

export default component$(() => {
  return (
    <>
      <main>
        <Slot />
      </main>
    </>
  );
});
