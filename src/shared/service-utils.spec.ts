import { describe, expect, test } from "vitest";

import type { Service, ServiceGroup } from "~/types";
import {
	getCategoryDescription,
	getCategoryStartingPrice,
	getDisplayCategoryName,
	getGroupCoverImage,
	getServiceItemImage,
	groupServicesAndCategories,
	isLaserCategory,
	resolveCoverImage,
} from "./service-utils";

function createCategory(overrides: Partial<ServiceGroup> = {}): ServiceGroup {
	return {
		id: "group-1",
		name: "Manicure",
		name_en: "Manicure",
		priority: 10,
		...overrides,
	};
}

function createService(overrides: Partial<Service> = {}): Service {
	return {
		id: "service-1",
		group_id: "group-1",
		name: "Classic manicure",
		description: "Classic manicure service",
		duration: 60,
		price: 50,
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
		expect(resolveCoverImage("Brows & Lashes")).toBe("service:brows.webp");
		expect(resolveCoverImage("Laser Hair Removal Face")).toBe(
			"service:laser-face.webp",
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
			expect.stringContaining("pedicure.webp"),
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

describe("getDisplayCategoryName", () => {
	test("returns capitalized category name when available", () => {
		const category = createCategory({ name: "manicure" });
		expect(getDisplayCategoryName(category, "Default")).toBe("Manicure");
	});

	test("returns fallback when category is undefined", () => {
		expect(getDisplayCategoryName(undefined, "Fallback")).toBe("Fallback");
	});

	test("returns fallback when category name is empty", () => {
		const category = createCategory({ name: "" });
		expect(getDisplayCategoryName(category, "Default")).toBe("Default");
	});
});

describe("getCategoryDescription", () => {
	const labels = {
		manicure: "Manicure description",
		pedicure: "Pedicure description",
		brows: "Brows description",
		laser: "Laser description",
		general: "General description",
	};

	test("matches manicure by name_en", () => {
		const category = createCategory({ name_en: "Manicure" });
		expect(getCategoryDescription(category, labels)).toBe(
			"Manicure description",
		);
	});

	test("matches pedicure by name fallback", () => {
		const category = createCategory({ name: "Pedicure", name_en: "" });
		expect(getCategoryDescription(category, labels)).toBe(
			"Pedicure description",
		);
	});

	test("matches brows by name_en", () => {
		const category = createCategory({ name_en: "Brows & Lashes" });
		expect(getCategoryDescription(category, labels)).toBe("Brows description");
	});

	test("matches laser by name_en", () => {
		const category = createCategory({
			name_en: "Laser Hair Removal Face",
		});
		expect(getCategoryDescription(category, labels)).toBe("Laser description");
	});

	test("matches removal as laser", () => {
		const category = createCategory({ name_en: "Tattoo Removal" });
		expect(getCategoryDescription(category, labels)).toBe("Laser description");
	});

	test("returns general description for unknown category", () => {
		const category = createCategory({ name_en: "Unknown Service" });
		expect(getCategoryDescription(category, labels)).toBe(
			"General description",
		);
	});

	test("returns general description when category is undefined", () => {
		expect(getCategoryDescription(undefined, labels)).toBe(
			"General description",
		);
	});
});

describe("isLaserCategory", () => {
	test("returns true for laser categories", () => {
		expect(
			isLaserCategory(createCategory({ name_en: "Laser Hair Removal Face" })),
		).toBe(true);
	});

	test("returns true for removal categories", () => {
		expect(isLaserCategory(createCategory({ name_en: "Tattoo Removal" }))).toBe(
			true,
		);
	});

	test("returns false for manicure", () => {
		expect(isLaserCategory(createCategory({ name_en: "Manicure" }))).toBe(
			false,
		);
	});

	test("returns false for undefined category", () => {
		expect(isLaserCategory(undefined)).toBe(false);
	});

	test("is case-insensitive", () => {
		expect(
			isLaserCategory(createCategory({ name_en: "laser hair removal" })),
		).toBe(true);
	});
});

describe("getCategoryStartingPrice", () => {
	test("returns formatted starting price for a group of services", () => {
		const services = [
			createService({ price: 70 }),
			createService({ price: 40 }),
			createService({ price: 55 }),
		];

		const result = getCategoryStartingPrice(services, "From");
		expect(result).toContain("From");
		expect(result).toContain("40");
	});

	test("returns undefined for empty service list", () => {
		expect(getCategoryStartingPrice([], "From")).toBeUndefined();
	});

	test("formats single service price correctly", () => {
		const services = [createService({ price: 35 })];
		const result = getCategoryStartingPrice(services, "From");
		expect(result).toBeDefined();
		expect(result).toContain("35");
	});
});
