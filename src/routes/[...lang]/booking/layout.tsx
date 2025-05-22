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

// Function to get upcoming bookings by user email
// export async function getUpcomingBookingsByEmail(
//   email: string,
//   req: RequestEventAction,
// ) {
//   // Step 1: Fetch client_id by email
//   const { data: clientData, error: clientError } = await supabase(req)
//     .from("clients")
//     .select("*")
//     .eq("email", email)
//     .single(); // Expecting a single row

//   console.log("clientData:", clientData);
//   if (clientError) {
//     console.error("Error fetching client:", clientError);
//     return [];
//   }

//   const clientId = clientData.id;

//   // Step 2: Fetch upcoming bookings for this client_id
//   const { data: bookingsData, error: bookingsError } = await supabase(req)
//     .from("bookings")
//     .select("*")
//     .eq("client_id", clientId)
//     .gt("datetime", new Date().toISOString()) // Future bookings
//     .order("datetime", { ascending: true }); // Optional: order by datetime ascending

//   if (bookingsError) {
//     console.error("Error fetching bookings:", bookingsError);
//     return [];
//   }

//   // get service names by ids per booking and return service_names in bookingsData
//   const bookingsWithServiceNames = await Promise.all(
//     bookingsData.map(async (booking) => {
//       const services = await supabase(req)
//         .from("services")
//         .select("name,name_ru,name_nl,name_fr")
//         .in("id", booking.services);

//       if (services.error) {
//         console.error("Error fetching services:", services.error);
//         return booking;
//       }

//       const s = services.data as Service[];

//       return {
//         ...booking,
//         // get name based on locale

//         services_names: s.map((service) => {
//           const shortlocal = req.locale().split("-")[0];
//           if (shortlocal === "ru") {
//             return service.name_ru;
//           }
//           if (shortlocal === "nl") {
//             return service.name_nl;
//           }
//           if (shortlocal === "fr") {
//             return service.name_fr;
//           }
//           return service.name;
//         }) as string[],
//       };
//     }),
//   );
//   return bookingsWithServiceNames as Booking[];
// }

// export const useGetScheduledAppointments = routeLoader$(async (req) => {
//   const {
//     data: { session },
//   } = await supabase(req).auth.getSession();
//   const userEmail = session?.user.email || "";
//   if (!userEmail) {
//     console.error("No user email found");
//     return [];
//   }
//   const bookings = await getUpcomingBookingsByEmail(userEmail, req);
//   return bookings;
// });

export default component$(() => {
	return <Slot />;
});
