import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CookieBanner } from "~/components/ui/cookie-banner";
import {
	localizeServiceGroups,
	localizeServices,
} from "~/shared/locale-content";
import { supabase } from "~/shared/supabase-client";
import type { Contact, Service, ServiceGroup, Staff } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		maxAge: 60 * 5,
	});
};

export const useContactLoader = routeLoader$<Contact | null>(async (event) => {
	console.log("Fetching contact info from Supabase…");

	const client = supabase(event);

	const { data, error } = await client
		.schema("gettimely")
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

export const useServiceGroupsLoader = routeLoader$<ServiceGroup[]>(
	async (requestEv) => {
		console.log("Fetching service groups from Supabase");

		const client = supabase(requestEv);
		const { data, error } = await client
			.schema("gettimely")
			.from("service_groups")
			.select("*")
			.order("priority", { ascending: true });

		if (error) {
			console.error("Error fetching service groups:", error);
			return [];
		}

		return localizeServiceGroups(data, requestEv.locale());
	},
);

export const useTechniciansLoader = routeLoader$<Staff[]>(async (requestEv) => {
	console.log("Fetching staff from Supabase");

	const client = supabase(requestEv);
	const { data, error } = await client
		.schema("gettimely")
		.from("staff")
		.select("*")
		.eq("active", true);

	if (error) {
		console.error("Error fetching staff:", error);
		return [];
	}
	return (data ?? []) as Staff[];
});

export const useServicesLoader = routeLoader$<Service[]>(async (requestEv) => {
	console.log("Fetching services from Supabase");

	const client = supabase(requestEv);
	const { data, error } = await client
		.schema("gettimely")
		.from("services")
		.select("*")
		.eq("active", true)
		.order("priority", { ascending: true });

	if (error) {
		console.error("Error fetching services:", error);
		return [];
	}

	return localizeServices(data, requestEv.locale());
});

export default component$(() => {
	return (
		<main>
			<Slot />
			<CookieBanner />
		</main>
	);
});
