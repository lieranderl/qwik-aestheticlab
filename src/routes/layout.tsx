import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

import Header from "~/components/header/header";

import styles from "./styles.css?inline";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useTechniciansLoader = routeLoader$(async () => {
  try {
    const response = await fetch(
      "https://jfedotov.app.n8n.cloud/webhook/f5856c87-6629-4338-98b2-8580c868c441/technicians"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
});

export const useServicesLoader = routeLoader$(async () => {
  try {
    const response = await fetch(
      "https://jfedotov.app.n8n.cloud/webhook/f5856c87-6629-4338-98b2-8580c868c441/services"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
});

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});
