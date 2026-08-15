import type { GroupedServiceData } from "~/shared/service-utils";
import { isLaserCategory } from "~/shared/service-utils";
import type { ServiceGroup } from "~/types";

export interface DisplayServiceGroup extends GroupedServiceData {
	displayTitle: string;
}

export interface TreatmentSelection {
	selectedCategoryId: string | null;
	selectedLaserSubgroupId: string | null;
	showFullList: boolean;
}

export function buildLaserSubgroups(
	groups: GroupedServiceData[],
	laserCategoryLabel: string,
): DisplayServiceGroup[] {
	return groups
		.filter((group) => isLaserCategory(group.category))
		.sort((a, b) => b.priority - a.priority)
		.map((group) => ({
			...group,
			displayTitle: group.category?.name || laserCategoryLabel,
		}));
}

export function buildDisplayGroups(
	groups: GroupedServiceData[],
	defaultCategoryLabel: string,
	laserCategoryLabel: string,
): DisplayServiceGroup[] {
	const laserGroups = groups.filter((group) => isLaserCategory(group.category));
	const standardGroups = groups.filter(
		(group) => !isLaserCategory(group.category),
	);

	if (laserGroups.length === 0) {
		return groups.map((group) => ({
			...group,
			displayTitle: group.category?.name || defaultCategoryLabel,
		}));
	}

	const mergedLaserGroup: DisplayServiceGroup = {
		...laserGroups[0],
		groupId: "laser",
		realGroupId: "laser",
		groupServices: laserGroups
			.flatMap((group) => group.groupServices)
			.sort((a, b) => a.price - b.price),
		priority: Math.max(...laserGroups.map((group) => group.priority)),
		displayTitle: laserCategoryLabel,
		coverImageName: "laser",
	};

	return [...standardGroups, mergedLaserGroup]
		.sort((a, b) => b.priority - a.priority)
		.map((group) => ({
			...group,
			displayTitle:
				"displayTitle" in group
					? (group as DisplayServiceGroup).displayTitle
					: group.category?.name || defaultCategoryLabel,
		}));
}

export function resolveTreatmentSelection(
	displayGroups: DisplayServiceGroup[],
	laserSubgroups: DisplayServiceGroup[],
	categoryId: string | null | undefined,
	subgroupId: string | null | undefined,
): TreatmentSelection {
	const selectedCategoryId = displayGroups.some(
		(group) => group.groupId === categoryId,
	)
		? categoryId || null
		: null;
	const selectedLaserSubgroupId =
		selectedCategoryId === "laser" &&
		laserSubgroups.some((group) => group.groupId === subgroupId)
			? subgroupId || null
			: null;

	return {
		selectedCategoryId,
		selectedLaserSubgroupId,
		showFullList: Boolean(selectedCategoryId),
	};
}

export function createCategoryIndex(categories: ServiceGroup[]) {
	return new Map(categories.map((category) => [String(category.id), category]));
}
