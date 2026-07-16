const serviceGroups = [
	{ id: "manicure", name: "Manicure", priority: 40 },
	{ id: "pedicure", name: "Pedicure", priority: 30 },
	{ id: "brows", name: "Brows & Lashes", priority: 20 },
	{ id: "laser-face", name: "Laser Hair Removal Face", priority: 10 },
].map((group) => ({
	...group,
	active: true,
	name_fr: group.name,
	name_nl: group.name,
	name_ru: group.name,
	name_uk: group.name,
}));

const services = serviceGroups.map((group, index) => ({
	id: `service-${index + 1}`,
	group_id: group.id,
	category: group.name,
	name: `${group.name} service`,
	name_fr: "",
	name_nl: "",
	name_ru: "",
	name_uk: "",
	description: `${group.name} treatment description`,
	description_fr: "",
	description_nl: "",
	description_ru: "",
	description_uk: "",
	duration: 60,
	price: 50 + index * 10,
	priority: group.priority,
	active: true,
}));

function json(data: unknown, status = 200) {
	return Response.json(data, {
		status,
		headers: {
			"Content-Range": "0-*/*",
		},
	});
}

const tableColumns: Record<string, Set<string>> = {
	service_groups: new Set([
		"id",
		"name",
		"name_fr",
		"name_nl",
		"name_ru",
		"name_uk",
		"priority",
	]),
	services: new Set([
		"id",
		"group_id",
		"name",
		"name_fr",
		"name_nl",
		"name_ru",
		"name_uk",
		"description",
		"description_fr",
		"description_nl",
		"description_ru",
		"description_uk",
		"duration",
		"price",
	]),
	contacts: new Set(["email", "open_hours", "location", "parking"]),
	staff: new Set([
		"id",
		"name",
		"photo_url",
		"about",
		"about_fr",
		"about_nl",
		"about_ru",
		"about_uk",
		"role",
	]),
};

function hasValidProjection(url: URL, table: string) {
	const select = url.searchParams.get("select");
	if (!select) return true;

	const columns = tableColumns[table];
	return select.split(",").every((column) => columns?.has(column));
}

Bun.serve({
	hostname: "127.0.0.1",
	port: 43121,
	fetch(request) {
		const url = new URL(request.url);
		const { pathname } = url;

		if (pathname === "/health") return json({ status: "ok" });

		const table = pathname.split("/").at(-1) ?? "";
		if (table in tableColumns && !hasValidProjection(url, table)) {
			return json(
				{ code: "42703", message: "selected column does not exist" },
				400,
			);
		}

		if (table === "service_groups") return json(serviceGroups);
		if (table === "services") return json(services);
		if (table === "contacts") return json(null);
		if (table === "staff") return json([]);

		return new Response("Not found", { status: 404 });
	},
});
