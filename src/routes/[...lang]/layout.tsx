import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "~/shared/supabase-client";
import type { Service, ServiceCategory, Technician } from "~/types";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		maxAge: 5,
	});
};

export const useEnvLoader = routeLoader$(({ env }) => {
	const API_BASE_URL = env.get("API_BASE_URL") || "";
	const API_TOKEN = env.get("API_TOKEN") || "";
	return {
		API_BASE_URL,
		API_TOKEN,
	};
});

export const useServerTimeLoader = routeLoader$(() => {
	return {
		date: new Date().toISOString(),
	};
});

export const useServicesCategoryLoader = routeLoader$(async (requestEv) => {
	console.log("Fetching categories from Supabase");
	const response = await supabase(requestEv)
		.from("category_service")
		.select("*");
	const data = response.data as ServiceCategory[];
	if (response.error) {
		console.error("Error fetching categories:", response.error);
		return [];
	}
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!data) {
		return [];
	}
	// use local and return correct name based on locale
	const locale = requestEv.locale().split("-")[0];
	const shortlang = locale === "en" ? "en" : locale;

	const categories = data.map((category) => ({
		id: category.id,
		priority: category.priority,
		name:
			shortlang === "en"
				? category.name
				: shortlang === "ru"
					? category.name_ru
					: shortlang === "nl"
						? category.name_nl
						: shortlang === "fr"
							? category.name_fr
							: shortlang === "uk"
								? category.name_uk
								: category.name,
	}));

	return categories;
});

export const useTechniciansLoader = routeLoader$<Technician[]>(
	async ({ env }) => {
		const API_BASE_URL = env.get("API_BASE_URL");
		const API_TOKEN = env.get("API_TOKEN");
		console.log(`Sending request to: ${API_BASE_URL}/technicians`);
		try {
			const response = await fetch(`${API_BASE_URL}/technicians`, {
				headers: {
					Authorization: `${API_TOKEN}`,
					"Content-Type": "application/json",
				},
			});
			const data: Technician[] = await response.json();
			return data.filter((technician) => technician.active);
		} catch (error) {
			console.error("Error fetching technicians:", error);
			return [];
		}
	},
);

export const useServicesLoader = routeLoader$(async ({ env, locale }) => {
	const API_BASE_URL = env.get("API_BASE_URL");
	const API_TOKEN = env.get("API_TOKEN");
	console.log(`Sending request to: ${API_BASE_URL}/services`);
	try {
		const response = await fetch(`${API_BASE_URL}/services`, {
			headers: {
				Authorization: `${API_TOKEN}`,
				"Content-Type": "application/json",
			},
		});
		const data: Service[] = await response.json();
		// set name based on locale
		const shortlocal = locale().split("-")[0];
		for (const service of data) {
			if (shortlocal === "ru") {
				service.name = service.name_ru;
			} else if (shortlocal === "nl") {
				service.name = service.name_nl;
			} else if (shortlocal === "fr") {
				service.name = service.name_fr;
			} else if (shortlocal === "uk") {
				service.name = service.name_uk;
			}
		}
		for (const service of data) {
			if (shortlocal === "ru") {
				service.description = service.description_ru;
			} else if (shortlocal === "nl") {
				service.description = service.description_nl;
			} else if (shortlocal === "fr") {
				service.description = service.description_fr;
			} else if (shortlocal === "uk") {
				service.description = service.description_uk;
			}
		}
		// map Service to ServiceFiltered
		data
			.filter((service) => service.active)
			.sort((a, b) => a.priority - b.priority)
			.map((service) => {
				return {
					id: service.id,
					name: service.name,
					duration: service.duration,
					price: service.price,
					description: service.description,
					created_at: service.created_at,
					priority: service.priority,
					category_id: service.category_id,
				};
			});
		return data as Service[];
	} catch (error) {
		console.error("Error fetching services:", error);
		return [];
	}
});

export default component$(() => {
	return (
		<>
			<main>
				<Slot />
			</main>
		</>
	);
});
