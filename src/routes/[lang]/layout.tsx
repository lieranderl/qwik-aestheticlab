import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";
import { routeLoader$ } from "@qwik.dev/router";
import { CookieBanner } from "~/components/ui/cookie-banner";
import { config } from "~/i18n-config";
import { logServerEvent } from "~/shared/server-logging";
import { supabase } from "~/shared/supabase-client";
import {
	projectContact,
	projectServiceGroups,
	projectServices,
	projectStaff,
	serviceColumns,
	serviceGroupColumns,
	staffColumns,
} from "~/shared/supabase-data";
import type { Contact, Service, ServiceGroup, Staff } from "~/types";

export const onRequest: RequestHandler = ({ params, error }) => {
	const isSupportedLocale = config.supportedLocales.some(
		(locale) => locale.lang === params.lang,
	);
	if (!isSupportedLocale) {
		throw error(404, "Not Found");
	}
};

// Keep the HTML window short: each Cloud Run revision only ships its own hashed
// /build/ chunks, so long-lived stale HTML can reference chunks that no longer exist.
export const onGet: RequestHandler = async ({
	cacheControl,
	internalRequest,
}) => {
	if (internalRequest !== "loader") {
		cacheControl({
			staleWhileRevalidate: 60 * 10,
			maxAge: 60,
		});
	}
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
		.select("email,open_hours,location,parking")
		.eq("id", 1)
		.single();

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "contact",
			error,
		});
		return null;
	}

	return projectContact(data);
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
			.select(serviceGroupColumns(requestEv.locale()))
			.eq("active", true)
			.order("priority", { ascending: true });

		if (error) {
			logServerEvent("ERROR", "supabase_fetch_failed", {
				resource: "service_groups",
				error,
			});
			return [];
		}

		return projectServiceGroups(data, requestEv.locale());
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
		.select(staffColumns(requestEv.locale()))
		.eq("active", true)
		.order("id", { ascending: true });

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "staff",
			error,
		});
		return [];
	}
	return projectStaff(data, requestEv.locale());
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
		.select(serviceColumns(requestEv.locale()))
		.eq("active", true)
		.order("priority", { ascending: true });

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "services",
			error,
		});
		return [];
	}

	return projectServices(data, requestEv.locale());
});

export default component$(() => {
	return (
		<>
			<Slot />
			<CookieBanner />
		</>
	);
});
