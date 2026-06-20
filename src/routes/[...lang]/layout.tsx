import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CookieBanner } from "~/components/ui/cookie-banner";
import {
	localizeServiceGroups,
	localizeServices,
} from "~/shared/locale-content";
import { logServerEvent } from "~/shared/server-logging";
import { supabase } from "~/shared/supabase-client";
import type { Contact, Service, ServiceGroup, Staff } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		maxAge: 60 * 5,
	});
};

export const useContactLoader = routeLoader$<Contact | null>(async (event) => {
	const client = supabase(event);
	if (!client) {
		logServerEvent("ERROR", "supabase_configuration_rejected", {
			resource: "contact",
		});
		return null;
	}

	const { data, error } = await client
		.schema("gettimely")
		.from("contacts")
		.select("*")
		.eq("id", 1)
		.single();

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "contact",
			error,
		});
		return null;
	}

	return data as Contact;
});

export const useServiceGroupsLoader = routeLoader$<ServiceGroup[]>(
	async (requestEv) => {
		const client = supabase(requestEv);
		if (!client) {
			logServerEvent("ERROR", "supabase_configuration_rejected", {
				resource: "service_groups",
			});
			return [];
		}
		const { data, error } = await client
			.schema("gettimely")
			.from("service_groups")
			.select("*")
			.order("priority", { ascending: true });

		if (error) {
			logServerEvent("ERROR", "supabase_fetch_failed", {
				resource: "service_groups",
				error,
			});
			return [];
		}

		return localizeServiceGroups(data, requestEv.locale());
	},
);

export const useTechniciansLoader = routeLoader$<Staff[]>(async (requestEv) => {
	const client = supabase(requestEv);
	if (!client) {
		logServerEvent("ERROR", "supabase_configuration_rejected", {
			resource: "staff",
		});
		return [];
	}
	const { data, error } = await client
		.schema("gettimely")
		.from("staff")
		.select("*")
		.eq("active", true);

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "staff",
			error,
		});
		return [];
	}
	return (data ?? []) as Staff[];
});

export const useServicesLoader = routeLoader$<Service[]>(async (requestEv) => {
	const client = supabase(requestEv);
	if (!client) {
		logServerEvent("ERROR", "supabase_configuration_rejected", {
			resource: "services",
		});
		return [];
	}
	const { data, error } = await client
		.schema("gettimely")
		.from("services")
		.select("*")
		.eq("active", true)
		.order("priority", { ascending: true });

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "services",
			error,
		});
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
