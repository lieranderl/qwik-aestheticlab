import { formatPremiumPrice } from "~/consts";
import type { Service, ServiceGroup } from "~/types";

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

// Override specific cover image filenames (defaults to `{name}.webp`)
const COVER_IMAGE_OVERRIDES: Record<string, string> = {
	"face-waxing": "face-waxing.jpg",
	manicure: "manicure.jpg",
	pedicure: "pedicure.jpg",
	laser: "laser.jpg",
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

const SERVICE_COVER_IMAGE_NAMES = new Set([
	"brows",
	"face-waxing",
	"laser-body",
	"laser-combo",
	"laser-face",
	"laser-male",
	"laser",
	"manicure",
	"pedicure",
]);

const GALLERY_IMAGE_NAMES = new Set([
	"eyebrows1",
	"eyebrows2",
	"lazer1",
	"manicure1",
	"manicure2",
	"manicure3",
	"manicure4",
	"manicure5",
	"manicure6",
	"pedicure1",
	"pedicure2",
	"pedicure3",
	"pedicure4",
	"pedicure5",
	"pedicure6",
	"removal1",
]);

// ============================================================================
// Category Display Helpers
// ============================================================================

export function getDisplayCategoryName(
	category: ServiceGroup | undefined,
	fallback: string,
): string {
	const name = category?.name || fallback;
	return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getCategoryDescription(
	category: ServiceGroup | undefined,
	labels: {
		manicure: string;
		pedicure: string;
		brows: string;
		laser: string;
		waxing?: string;
		general: string;
	},
): string {
	const normalizedName = (
		category?.name_en ||
		category?.name ||
		""
	).toLowerCase();

	if (normalizedName.includes("manicure")) return labels.manicure;
	if (normalizedName.includes("pedicure")) return labels.pedicure;
	if (normalizedName.includes("brows") || normalizedName.includes("lashes"))
		return labels.brows;
	if (normalizedName.includes("laser") || normalizedName.includes("removal"))
		return labels.laser;
	if (normalizedName.includes("wax") && labels.waxing) return labels.waxing;

	return labels.general;
}

export function isLaserCategory(category: ServiceGroup | undefined): boolean {
	const normalizedName = (
		category?.name_en ||
		category?.name ||
		""
	).toLowerCase();
	return normalizedName.includes("laser") || normalizedName.includes("removal");
}

// Add-ons (repairs, nail art, coating removal) are booked on top of a
// treatment, so they must not set a category's "from" price.
const ADD_ON_PATTERN = /^extra\b|coating removal/i;

// Classify by the English base name: translated names (e.g. Dutch
// "verwijderen") would otherwise slip add-ons into the main list.
export function isAddOnService(
	service: Pick<Service, "name" | "name_en">,
): boolean {
	return ADD_ON_PATTERN.test((service.name_en || service.name).trim());
}

/** Main treatments of a group; falls back to every service when all are add-ons. */
export function getMainServices(groupServices: Service[]): Service[] {
	const main = groupServices.filter((service) => !isAddOnService(service));
	return main.length > 0 ? main : groupServices;
}

/** Lowest add-on price across all services, if any add-ons exist. */
export function getLowestAddOnPrice(services: Service[]): number | undefined {
	const prices = services
		.filter((service) => isAddOnService(service))
		.map((service) => service.price);
	return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function getCategoryStartingPrice(
	groupServices: Service[],
	fromLabel: string,
	locale = "en-BE",
): string | undefined {
	if (groupServices.length === 0) return undefined;
	const startingPrice = Math.min(
		...getMainServices(groupServices).map((service) => service.price),
	);
	return `${fromLabel} ${formatPremiumPrice(startingPrice, locale)}`;
}

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
	if (SERVICE_COVER_IMAGE_NAMES.has(mapped)) {
		const filename = COVER_IMAGE_OVERRIDES[mapped] ?? `${mapped}.webp`;
		return `service:${filename}`;
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
		const imageName = `${config.prefix}${num}`;
		if (GALLERY_IMAGE_NAMES.has(imageName)) {
			return `gallery:${imageName}.jpg`;
		}
	}

	return getGroupCoverImage(category);
}

export function resolveCoverImage(imageName: string): string {
	const mapped = mapName(imageName);

	if (SERVICE_COVER_IMAGE_NAMES.has(mapped)) {
		const filename = COVER_IMAGE_OVERRIDES[mapped] ?? `${mapped}.webp`;
		return `service:${filename}`;
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

/** "manicure" → "Manicure": some translated category names start lowercase. */
export function capitalizeFirst(value: string): string {
	return value ? value.charAt(0).toLocaleUpperCase() + value.slice(1) : value;
}
