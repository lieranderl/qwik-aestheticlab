import { component$, Slot } from "@builder.io/qwik";
import type { RequestEventAction } from "@builder.io/qwik-city";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { useAuthSession } from "~/shared/auth-session";
import { supabase } from "~/shared/supabase-client";
import type { Booking } from "~/types";
export { useAuthSession };

export const useSupabaseSignOut = routeAction$(async (_, requestEv) => {
	const { error } = await supabase(requestEv).auth.signOut();

	if (error) {
		console.log("Error signing out:", error);
		return { success: false, error: { message: error.message } };
	}
	console.log("Sign out successful");
	console.log(requestEv.pathname);
	throw requestEv.redirect(302, requestEv.pathname);
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

// Function to get upcoming bookings by user email
async function getUpcomingBookingsByEmail(
	email: string,
	req: RequestEventAction,
) {
	// Step 1: Fetch client_id by email
	const { data: clientData, error: clientError } = await supabase(req)
		.from("clients")
		.select("*")
		.eq("email", email)
		.single(); // Expecting a single row

	console.log("clientData:", clientData);
	if (clientError) {
		console.error("Error fetching client:", clientError);
		return [];
	}

	const clientId = clientData.id;

	// Step 2: Fetch upcoming bookings for this client_id
	const { data: bookingsData, error: bookingsError } = await supabase(req)
		.from("bookings")
		.select("*")
		.eq("client_id", clientId)
		.gt("datetime", new Date().toISOString()) // Future bookings
		.order("datetime", { ascending: true }); // Optional: order by datetime ascending

	if (bookingsError) {
		console.error("Error fetching bookings:", bookingsError);
		return [];
	}

	// get service names by ids per booking and return service_names in bookingsData
	const bookingsWithServiceNames = await Promise.all(
		bookingsData.map(async (booking) => {
			const services = await supabase(req)
				.from("services")
				.select("name")
				.in("id", booking.services);
			return {
				...booking,
				services_names: services.data?.map((service) => service.name),
			};
		}),
	);
	return bookingsWithServiceNames as Booking[];
}

export const useGetScheduledAppointments = routeLoader$(async (req) => {
	const {
		data: { session },
	} = await supabase(req).auth.getSession();
	const userEmail = session?.user.email || "";
	const bookings = await getUpcomingBookingsByEmail(userEmail, req);
	return bookings;
});

export default component$(() => {
	const authSession = useAuthSession();
	console.log(authSession.value.user);
	return <Slot />;
});
