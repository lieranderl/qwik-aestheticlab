import { describe, expect, test } from "vitest";

import type { Service, ServiceGroup } from "~/types";
import {
	getGroupCoverImage,
	getServiceItemImage,
	groupServicesAndCategories,
	resolveCoverImage,
} from "./service-utils";

function createCategory(overrides: Partial<ServiceGroup> = {}): ServiceGroup {
	return {
		id: "group-1",
		name: "Manicure",
		name_ru: "Маникюр",
		name_nl: "Manicure",
		name_fr: "Manucure",
		name_uk: "Манікюр",
		name_en: "Manicure",
		active: true,
		priority: 10,
		...overrides,
	};
}

function createService(overrides: Partial<Service> = {}): Service {
	return {
		id: "service-1",
		group_id: "group-1",
		category: "Manicure",
		name: "Classic manicure",
		name_ru: "Классический маникюр",
		name_nl: "Klassieke manicure",
		name_fr: "Manucure classique",
		name_uk: "Класичний манікюр",
		description: "Classic manicure service",
		description_ru: "Классический маникюр",
		description_nl: "Klassieke manicure",
		description_fr: "Manucure classique",
		description_uk: "Класичний манікюр",
		duration: 60,
		price: 50,
		priority: 1,
		active: true,
		...overrides,
	};
}

describe("groupServicesAndCategories", () => {
	test("groups services by group_id and sorts items within each group by price", () => {
		const grouped = groupServicesAndCategories(
			[
				createService({ id: "s1", group_id: "group-1", price: 70 }),
				createService({ id: "s2", group_id: "group-1", price: 40 }),
				createService({
					id: "s3",
					group_id: "group-2",
					category: "Pedicure",
					price: 55,
				}),
			],
			[
				createCategory({
					id: "group-1",
					name: "Manicure",
					name_en: "Manicure",
				}),
				createCategory({
					id: "group-2",
					name: "Pedicure",
					name_en: "Pedicure",
					priority: 5,
				}),
			],
		);

		expect(grouped).toHaveLength(2);
		expect(grouped[0]?.groupId).toBe("group-1");
		expect(grouped[0]?.groupServices.map((service) => service.id)).toEqual([
			"s2",
			"s1",
		]);
		expect(grouped[1]?.groupServices.map((service) => service.id)).toEqual([
			"s3",
		]);
	});

	test("sorts groups by category priority in descending order", () => {
		const grouped = groupServicesAndCategories(
			[
				createService({ id: "low", group_id: "low-group", price: 50 }),
				createService({ id: "high", group_id: "high-group", price: 60 }),
			],
			[
				createCategory({
					id: "low-group",
					name: "Pedicure",
					name_en: "Pedicure",
					priority: 1,
				}),
				createCategory({
					id: "high-group",
					name: "Laser Hair Removal Face",
					name_en: "Laser Hair Removal Face",
					priority: 99,
				}),
			],
		);

		expect(grouped.map((group) => group.groupId)).toEqual([
			"high-group",
			"low-group",
		]);
		expect(grouped.map((group) => group.priority)).toEqual([99, 1]);
	});

	test("uses safe fallback values when a category is missing", () => {
		const grouped = groupServicesAndCategories(
			[
				createService({
					id: "orphan",
					group_id: "missing-group",
					category: "Unknown",
					price: 65,
				}),
			],
			[],
		);

		expect(grouped).toEqual([
			expect.objectContaining({
				groupId: "missing-group",
				realGroupId: "missing-group",
				category: undefined,
				priority: 0,
				displayTitleDefault: "Services",
				displayDescriptionDefault:
					"Professional beauty treatments for your refined look.",
				coverImageName: "universal",
			}),
		]);
	});
});

describe("service-utils image resolution", () => {
	test("maps special service names to the matching service cover asset", () => {
		expect(resolveCoverImage("Brows & Lashes")).toEqual(
			expect.stringContaining("brows.png"),
		);
		expect(resolveCoverImage("Laser Hair Removal Face")).toEqual(
			expect.stringContaining("laser-face.png"),
		);
	});

	test("falls back to the universal image when no cover asset matches", () => {
		expect(resolveCoverImage("Completely Unknown Service")).toEqual(
			expect.stringContaining("universal.jpg"),
		);
	});

	test("uses name fallback for group cover images when name_en is blank", () => {
		const category = createCategory({
			name: "Pedicure",
			name_en: "",
		});

		expect(getGroupCoverImage(category)).toEqual(
			expect.stringContaining("pedicure.png"),
		);
	});

	test("rotates gallery images for configured categories and falls back when needed", () => {
		const manicureCategory = createCategory({
			name: "Manicure",
			name_en: "Manicure",
		});
		const laserCategory = createCategory({
			name: "Laser Hair Removal Face",
			name_en: "Laser Hair Removal Face",
		});

		expect(getServiceItemImage(manicureCategory, 0)).toEqual(
			expect.stringContaining("manicure1.jpg"),
		);
		expect(getServiceItemImage(manicureCategory, 7)).toEqual(
			expect.stringContaining("manicure2.jpg"),
		);
		expect(getServiceItemImage(laserCategory, 3)).toEqual(
			expect.stringContaining("lazer1.jpg"),
		);
		expect(
			getServiceItemImage(
				createCategory({
					name: "Mystery Service",
					name_en: "Mystery Service",
				}),
				0,
			),
		).toEqual(expect.stringContaining("universal.jpg"));
	});
});
