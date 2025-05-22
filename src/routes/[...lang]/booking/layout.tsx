import { component$, Slot } from "@builder.io/qwik";
// import type { RequestEventAction } from "@builder.io/qwik-city";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { useAuthUser } from "~/shared/auth-session";
import { supabase } from "~/shared/supabase-client";
import type { Admin } from "~/types";
export { useAuthUser };

export const useSupabaseSignOut = routeAction$(async (_, requestEv) => {
  const { error } = await supabase(requestEv).auth.signOut();
  if (error) {
    console.error("SignOUT error:", error.message);
    console.log("Manually removing the token from cookies");
    const allCookies = requestEv.cookie.getAll();
    for (const [name] of Object.entries(allCookies)) {
      if (name.endsWith("-auth-token")) {
        requestEv.cookie.delete(name);
      }
    }
  }
  return {
    success: true,
  };
});

export const useRemoveBooking = routeAction$(async (data, { env }) => {
  console.log("REMOVE ACTION");
  console.log(data);
  const API_BASE_URL = env.get("API_BASE_URL");
  const API_TOKEN = env.get("API_TOKEN");
  console.log(`Sending request to: ${API_BASE_URL}/bookings/${data.bookingId}`);
  const response = await fetch(`${API_BASE_URL}/bookings/${data.bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${API_TOKEN}`,
    },
  });

  await response.json();
  if (!response.ok) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
});

export const useAdminsLoader = routeLoader$<Admin[]>(async ({ env }) => {
  const API_BASE_URL = env.get("API_BASE_URL");
  const API_TOKEN = env.get("API_TOKEN");
  console.log(`Sending request to: ${API_BASE_URL}/admins`);
  try {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      headers: {
        Authorization: `${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data: Admin[] = await response.json();
    return data.filter((admin) => admin.active);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
});

export default component$(() => {
  return <Slot />;
});
