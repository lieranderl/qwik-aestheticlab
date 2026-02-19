import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CookieBanner } from "~/components/ui/cookie-banner";
import { supabase } from "~/shared/supabase-client";
import type { Contact, Service, ServiceGroup, Staff } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		maxAge: 5,
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
		if (!data) return [];

		const locale = requestEv.locale().split("-")[0];
		const shortlang = locale === "en" ? "en" : locale;

		return data.map((group) => ({
			id: group.id,
			priority: group.priority,
			active: group.active,
			name:
				shortlang === "ru"
					? group.name_ru
					: shortlang === "nl"
						? group.name_nl
						: shortlang === "fr"
							? group.name_fr
							: shortlang === "uk"
								? group.name_uk
								: group.name,
			name_ru: group.name_ru,
			name_nl: group.name_nl,
			name_fr: group.name_fr,
			name_uk: group.name_uk,
			name_en: group.name,
		})) as ServiceGroup[];
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
	if (!data) return [];

	const shortlocal = requestEv.locale().split("-")[0];

	const localizedServices = data.map((service) => {
		const localizedName =
			shortlocal === "ru"
				? service.name_ru
				: shortlocal === "nl"
					? service.name_nl
					: shortlocal === "fr"
						? service.name_fr
						: shortlocal === "uk"
							? service.name_uk
							: service.name;

		const localizedDescription =
			shortlocal === "ru"
				? service.description_ru
				: shortlocal === "nl"
					? service.description_nl
					: shortlocal === "fr"
						? service.description_fr
						: shortlocal === "uk"
							? service.description_uk
							: service.description;

		return {
			id: service.id,
			group_id: service.group_id, // 🔑 match ServiceGroup
			category: service.category, // human-readable fallback
			name: localizedName,
			name_ru: service.name_ru,
			name_nl: service.name_nl,
			name_fr: service.name_fr,
			name_uk: service.name_uk,
			description: localizedDescription,
			description_ru: service.description_ru,
			description_nl: service.description_nl,
			description_fr: service.description_fr,
			description_uk: service.description_uk,
			duration: service.duration,
			price: service.price,
			priority: service.priority,
			active: service.active,
		} as Service;
	});

	return localizedServices;
});

export default component$(() => {
	return (
		<main>
			<Slot />
			<CookieBanner />
		</main>
	);
});
