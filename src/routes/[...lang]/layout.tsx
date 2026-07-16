import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CookieBanner } from "~/components/ui/cookie-banner";
import { logServerEvent } from "~/shared/server-logging";
import { supabase } from "~/shared/supabase-client";
import {
	projectContact,
	projectServiceGroups,
	projectServices,
	projectStaff,
} from "~/shared/supabase-data";
import { config } from "~/speak-config";
import type { Contact, Service, ServiceGroup, Staff } from "~/types";

export const onRequest: RequestHandler = ({ params, error }) => {
	const isSupportedLocale = config.supportedLocales.some(
		(locale) => locale.lang === params.lang,
	);
	if (!isSupportedLocale) {
		throw error(404, "Not Found");
	}
};

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
			.select("id,name,name_ru,name_nl,name_fr,name_uk,priority")
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
		.select("id,name,photo_url,about,about_ru,about_nl,about_fr,about_uk,role")
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
		.select(
			"id,group_id,name,name_ru,name_nl,name_fr,name_uk,description,description_ru,description_nl,description_fr,description_uk,duration,price",
		)
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
