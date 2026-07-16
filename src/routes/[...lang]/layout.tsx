import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CookieBanner } from "~/components/ui/cookie-banner";
import {
	getLocaleCode,
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

function resolveStaffAbout(staff: Staff, locale: string) {
	switch (getLocaleCode(locale)) {
		case "ru":
			return staff.about_ru || staff.about;
		case "nl":
			return staff.about_nl || staff.about;
		case "fr":
			return staff.about_fr || staff.about;
		case "uk":
			return staff.about_uk || staff.about;
		default:
			return staff.about;
	}
}

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

	return data ? (data as Contact) : null;
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
			.eq("active", true)
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
		.eq("active", true)
		.order("id", { ascending: true });

	if (error) {
		logServerEvent("ERROR", "supabase_fetch_failed", {
			resource: "staff",
			error,
		});
		return [];
	}
	return ((data ?? []) as Staff[]).map((staff) => ({
		...staff,
		about: resolveStaffAbout(staff, requestEv.locale()),
	}));
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
		<>
			<Slot />
			<CookieBanner />
		</>
	);
});
