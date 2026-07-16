import { describe, expect, it } from "vitest";
import {
	projectContact,
	projectServiceGroups,
	projectServices,
	projectStaff,
} from "./supabase-data";

describe("Supabase data projection", () => {
	it("localizes and strips raw catalogue fields before serialization", () => {
		const groups = projectServiceGroups(
			[
				{
					id: "group-1",
					name: "Manicure",
					name_fr: "Manucure",
					name_nl: "",
					name_ru: "",
					name_uk: "",
					priority: 10,
					internal_note: "must not cross the loader boundary",
				},
			],
			"fr-BE",
		);
		const services = projectServices(
			[
				{
					id: "service-1",
					group_id: "group-1",
					name: "Classic manicure",
					name_fr: "Manucure classique",
					name_nl: "",
					name_ru: "",
					name_uk: "",
					description: "English description",
					description_fr: "Description française",
					description_nl: "",
					description_ru: "",
					description_uk: "",
					duration: 60,
					price: 50,
					internal_note: "must not cross the loader boundary",
				},
			],
			"fr-BE",
		);

		expect(groups).toEqual([
			{
				id: "group-1",
				name: "Manucure",
				name_en: "Manicure",
				priority: 10,
			},
		]);
		expect(services).toEqual([
			{
				id: "service-1",
				group_id: "group-1",
				name: "Manucure classique",
				description: "Description française",
				duration: 60,
				price: 50,
			},
		]);
	});

	it("skips malformed catalogue and staff rows", () => {
		expect(projectServiceGroups([{ id: "missing-fields" }], "en-BE")).toEqual(
			[],
		);
		expect(projectServices([{ id: "missing-fields" }], "en-BE")).toEqual([]);
		expect(
			projectStaff(
				[
					{
						id: 2,
						name: "Julia",
						photo_url: "julia.jpg",
						about: "English bio",
						about_fr: "Bio française",
						role: "Nail artist",
						email: "private@example.com",
					},
					{ id: "invalid", name: null },
				],
				"fr-BE",
			),
		).toEqual([
			{
				id: 2,
				name: "Julia",
				photo_url: "julia.jpg",
				about: "Bio française",
				role: "Nail artist",
			},
		]);
	});

	it("accepts only complete contacts and safe external links", () => {
		const contact = projectContact({
			email: "hello@example.com",
			open_hours: {
				start_week_day: "Monday",
				end_week_day: "Saturday",
				from: "10:00",
				to: "18:00",
			},
			location: {
				name: "Leuven",
				address: "Main Street 1",
				link: "https://maps.example.com/location",
			},
			parking: [
				{ name: "Safe", link: "https://maps.example.com/parking" },
				{ name: "Unsafe", link: "javascript:alert(1)" },
			],
		});

		expect(contact?.parking).toEqual([
			{ name: "Safe", link: "https://maps.example.com/parking" },
		]);
		expect(
			projectContact({
				email: "hello@example.com",
				open_hours: { from: "10:00", to: "18:00" },
				location: {
					name: "Leuven",
					address: "Main Street 1",
					link: "javascript:alert(1)",
				},
			}),
		).toBeNull();
	});
});
