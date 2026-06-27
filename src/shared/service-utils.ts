import type { Service, ServiceGroup } from "~/types";

// ============================================================================
// Asset Imports
// ============================================================================

const ASSETS_GALLERY: Record<string, string> = import.meta.glob(
	"../media/gallery/*.jpg",
	{
		eager: true,
		import: "default",
	},
) as Record<string, string>;

const ASSETS_SERVICES: Record<string, string> = import.meta.glob(
	"../media/services/*.webp",
	{
		eager: true,
		import: "default",
	},
) as Record<string, string>;

// ============================================================================
// Image Configuration
// ============================================================================

// Map normalized DB names to actual file names (when they don't match)
const NAME_TO_FILE: Record<string, string> = {
	"brows-lashes": "brows",
	"laser-hair-removal-face": "laser-face",
	"laser-hair-removal-body": "laser-body",
	"laser-hair-removal-combo": "laser-combo",
	"laser-hair-removal-male": "laser-male",
};

// Gallery images per category: { prefix, count }
const GALLERY_CONFIG: Record<string, { prefix: string; count: number }> = {
	pedicure: { prefix: "pedicure", count: 6 },
	manicure: { prefix: "manicure", count: 6 },
	brows: { prefix: "eyebrows", count: 2 },
	"laser-face": { prefix: "lazer", count: 1 },
	"laser-body": { prefix: "lazer", count: 1 },
	"laser-combo": { prefix: "lazer", count: 1 },
	"laser-male": { prefix: "lazer", count: 1 },
	removal: { prefix: "removal", count: 1 },
};

// ============================================================================
// Helpers
// ============================================================================

function normalize(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function mapName(name: string): string {
	const normalized = normalize(name);
	return NAME_TO_FILE[normalized] || normalized;
}

// ============================================================================
// Public API
// ============================================================================

/** Get cover image for a service group (from services/ folder) */
export function getGroupCoverImage(category: ServiceGroup | undefined): string {
	const name = category?.name_en || category?.name || "";
	const mapped = mapName(name);
	for (const path in ASSETS_SERVICES) {
		if (path.toLowerCase().includes(mapped)) {
			return `service:${mapped}.webp`;
		}
	}
	return "gallery:universal.jpg";
}

/** Get image for individual service (from gallery/ folder with rotation) */
export function getServiceItemImage(
	category: ServiceGroup | undefined,
	index = 0,
): string {
	const categoryName = category?.name_en || category?.name || "";
	const mapped = mapName(categoryName);
	const config = GALLERY_CONFIG[mapped];

	if (config) {
		const num = (index % config.count) + 1;
		const key = `../media/gallery/${config.prefix}${num}.jpg`;
		if (ASSETS_GALLERY[key]) {
			return `gallery:${config.prefix}${num}.jpg`;
		}
	}

	return getGroupCoverImage(category);
}

export function resolveCoverImage(imageName: string): string {
	const mapped = mapName(imageName);

	for (const path in ASSETS_SERVICES) {
		if (path.toLowerCase().includes(mapped)) {
			return `service:${mapped}.webp`;
		}
	}
	return "gallery:universal.jpg";
}

// ============================================================================
// Grouping Logic
// ============================================================================

export interface GroupedServiceData {
	groupId: string;
	realGroupId: string;
	groupServices: Service[];
	category: ServiceGroup | undefined;
	priority: number;
	displayTitleDefault: string;
	displayDescriptionDefault: string;
	coverImageName: string;
}

export function groupServicesAndCategories(
	services: Service[],
	categories: ServiceGroup[],
): GroupedServiceData[] {
	const groupsMap: Record<string, Service[]> = {};

	for (const service of services) {
		const key = String(service.group_id);
		if (!groupsMap[key]) groupsMap[key] = [];
		groupsMap[key].push(service);
	}

	const result = Object.entries(groupsMap).map(([groupId, groupServices]) => {
		const category = categories.find((c) => String(c.id) === groupId);

		groupServices.sort((a, b) => a.price - b.price);

		return {
			groupId,
			realGroupId: groupId,
			groupServices,
			category,
			priority: category?.priority ?? 0,
			displayTitleDefault: category?.name || "Services",
			displayDescriptionDefault:
				"Professional beauty treatments for your refined look.",
			coverImageName: category?.name_en || category?.name || "universal",
		};
	});

	return result.sort((a, b) => b.priority - a.priority);
}
