import { describe, expect, it } from "vitest";
import {
	buildDisplayGroups,
	buildLaserSubgroups,
	createCategoryIndex,
	resolveTreatmentSelection,
} from "./service-catalog";
import type { GroupedServiceData } from "./service-utils";

function group(id: string, name: string, priority: number): GroupedServiceData {
	return {
		groupId: id,
		realGroupId: id,
		groupServices: [
			{
				id: `${id}-service`,
				group_id: id,
				name,
				description: "Description",
				duration: 60,
				price: priority,
			},
		],
		category: { id, name, name_en: name, priority },
		priority,
		displayTitleDefault: name,
		displayDescriptionDefault: "Description",
		coverImageName: name,
	};
}

describe("service catalogue view models", () => {
	it("merges laser groups while preserving standard categories", () => {
		const groups = [
			group("manicure", "Manicure", 40),
			group("laser-face", "Laser face", 20),
			group("laser-body", "Laser body", 10),
		];

		const display = buildDisplayGroups(groups, "Services", "Laser");
		expect(display.map((item) => item.groupId)).toEqual(["manicure", "laser"]);
		expect(
			display.find((item) => item.groupId === "laser")?.groupServices,
		).toHaveLength(2);
	});

	it("builds ordered laser subgroups", () => {
		const subgroups = buildLaserSubgroups(
			[
				group("laser-body", "Laser body", 10),
				group("laser-face", "Laser face", 20),
			],
			"Laser",
		);
		expect(subgroups.map((item) => item.groupId)).toEqual([
			"laser-face",
			"laser-body",
		]);
	});

	it("indexes categories for loader-backed grouping", () => {
		const manicure = {
			id: "manicure",
			name: "Manicure",
			name_en: "Manicure",
			priority: 40,
		};
		const index = createCategoryIndex([manicure]);
		expect(index.get("manicure")).toBe(manicure);
	});

	it("rejects invalid shared URL state", () => {
		const laser = buildDisplayGroups(
			[group("laser-face", "Laser face", 20)],
			"Services",
			"Laser",
		);
		const subgroups = buildLaserSubgroups(
			[group("laser-face", "Laser face", 20)],
			"Laser",
		);

		expect(
			resolveTreatmentSelection(laser, subgroups, "unknown", "unknown"),
		).toEqual({
			selectedCategoryId: null,
			selectedLaserSubgroupId: null,
			showFullList: false,
		});
		expect(
			resolveTreatmentSelection(laser, subgroups, "laser", "laser-face"),
		).toEqual({
			selectedCategoryId: "laser",
			selectedLaserSubgroupId: "laser-face",
			showFullList: true,
		});
	});
});
