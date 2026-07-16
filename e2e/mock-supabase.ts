const serviceGroups = [
	{ id: "manicure", name: "Manicure", priority: 40 },
	{ id: "pedicure", name: "Pedicure", priority: 30 },
	{ id: "brows", name: "Brows & Lashes", priority: 20 },
	{ id: "laser-face", name: "Laser Hair Removal Face", priority: 10 },
].map((group) => ({
	...group,
	active: true,
	name_en: group.name,
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

function json(data: unknown) {
	return Response.json(data, {
		headers: {
			"Content-Range": "0-*/*",
		},
	});
}

Bun.serve({
	hostname: "127.0.0.1",
	port: 43121,
	fetch(request) {
		const { pathname } = new URL(request.url);

		if (pathname === "/health") return json({ status: "ok" });
		if (pathname === "/rest/v1/service_groups") return json(serviceGroups);
		if (pathname === "/rest/v1/services") return json(services);
		if (pathname === "/rest/v1/contacts") return json(null);
		if (pathname === "/rest/v1/staff") return json([]);

		return new Response("Not found", { status: 404 });
	},
});
