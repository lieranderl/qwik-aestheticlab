import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { NotFoundPage } from "~/components/sections/not-found";
import { CookieBanner } from "~/components/ui/cookie-banner";
import { SmoothScroll } from "~/components/ui/smooth-scroll";
import { isSupportedLocaleParam } from "~/shared/locale-navigation";
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

// `[...lang]` also captures unknown paths (/de-BE/, /en-BE/old-link/). Those keep
// a 404 status but render the branded NotFoundPage instead of a bare error.
export const onRequest: RequestHandler = ({ params, status }) => {
	if (!isSupportedLocaleParam(params.lang)) {
		status(404);
	}
};

export const useNotFoundLoader = routeLoader$(
	({ params }) => !isSupportedLocaleParam(params.lang),
);

// Keep the HTML window short: each Cloud Run revision only ships its own hashed
// /build/ chunks, so long-lived stale HTML can reference chunks that no longer exist.
export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 10,
		maxAge: 60,
	});
};

export const useContactLoader = routeLoader$<Contact | null>(async (event) => {
	if (!isSupportedLocaleParam(event.params.lang)) return null;
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
		if (!isSupportedLocaleParam(requestEv.params.lang)) return [];
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
	if (!isSupportedLocaleParam(requestEv.params.lang)) return [];
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
	if (!isSupportedLocaleParam(requestEv.params.lang)) return [];
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
	const isNotFound = useNotFoundLoader();
	return (
		<>
			{isNotFound.value ? <NotFoundPage /> : <Slot />}
			<CookieBanner />
			<SmoothScroll />
		</>
	);
});
