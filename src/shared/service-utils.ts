import type { Service, ServiceGroup } from "~/types";

// ============================================================================
// Types & Constants
// ============================================================================

export type ServiceTheme =
	| "pedicure"
	| "manicure"
	| "brows_lashes"
	| "removal"
	| "laser-face"
	| "laser-body"
	| "laser-combo"
	| "laser-male"
	| "universal";

// ... (imports)

interface ThemeConfig {
	keywords: string[];
	coverImage: string;
	// If defined, uses this base for gallery items (e.g. "pedicure" -> "pedicure1.jpg")
	galleryBase?: string;
	// Number of available variant images for this theme. Defaults to 1.
	imageCount?: number;
	displayInfo: {
		titleKey?: string;
		titleDefault?: string;
		descKey: string;
		descDefault: string;
	};
}

const THEME_DEFINITIONS: Record<ServiceTheme, ThemeConfig> = {
	pedicure: {
		keywords: ["pedicure", "pédicure", "педикюр", "педи"],
		coverImage: "/media/gallery/pedicure1.jpg",
		galleryBase: "/media/gallery/pedicure",
		imageCount: 6, // We have pedicure1..6
		displayInfo: {
			descKey:
				"app.services.pedicure_desc@@Professional therapeutic care and aesthetic refinement for healthy, radiant feet.",
			descDefault:
				"Professional therapeutic care and aesthetic refinement for healthy, radiant feet.",
		},
	},
	manicure: {
		keywords: ["manicure", "manucure", "маникюр", "nails", "nail", "манікюр"],
		coverImage: "/media/gallery/manicure1.jpg",
		galleryBase: "/media/gallery/manicure",
		imageCount: 6, // We have manicure1..6
		displayInfo: {
			descKey:
				"app.services.manicure_desc@@Expert gel artistry and precision Russian techniques for naturally flawless nails.",
			descDefault:
				"Expert gel artistry and precision Russian techniques for naturally flawless nails.",
		},
	},
	// ... [other definitions remain similar, ensuring simple ones don't need imageCount if not using galleryBase]
	brows_lashes: {
		keywords: [
			"brow",
			"lash",
			"eye",
			"брови",
			"ресни",
			"wenkbrauwen",
			"sourcils",
		],
		coverImage: "/media/gallery/eyebrows1.jpg",
		galleryBase: "/media/gallery/eyebrows",
		imageCount: 2,
		displayInfo: {
			titleKey: "app.services.brows_lashes_title@@Brows & Lashes",
			titleDefault: "Brows & Lashes",
			descKey:
				"app.services.brows_desc@@Threading, tinting, and lamination for the perfect arch.",
			descDefault: "Threading, tinting, and lamination for the perfect arch.",
		},
	},
	removal: {
		keywords: ["removal", "dépose", "снятие"],
		coverImage: "/media/gallery/removal1.jpg",
		galleryBase: "/media/gallery/removal1.jpg",
		displayInfo: {
			descKey:
				"app.services.general_desc@@Professional beauty treatments for your refined look.",
			descDefault: "Professional beauty treatments for your refined look.",
		},
	},
	"laser-face": {
		keywords: [
			"FACE",
			"VISAGE",
			"GELAAT",
			"LIP",
			"CHIN",
			"BEARD",
			"NECK",
			"CHEEK",
			"NOSE",
			"EAR",
			"SIDE",
			"LEVRES",
			"MENTON",
			"BARBE",
			"COU",
			"JOUES",
			"NEZ",
			"OREILLES",
			"LIPPEN",
			"KIN",
			"BAARD",
			"HALS",
			"WANGEN",
			"NEUS",
			"OREN",
			"ЛИЦА",
			"ОБЛИЧЧЯ",
			"GEZICHT",
		],
		coverImage: "/media/services/laser-face.png",
		displayInfo: {
			titleKey: "app.services.laser_face_title@@Laser hair removal FACE",
			titleDefault: "Laser hair removal FACE",
			descKey:
				"app.services.laser_desc@@Safe, effective, and painless technology for smooth skin.",
			descDefault: "Safe, effective, and painless technology for smooth skin.",
		},
	},
	"laser-body": {
		keywords: ["BODY", "КОРПУС", "ТІЛА", "LICHAAM"], // Default fallback for Laser
		coverImage: "/media/services/laser-body.png",
		displayInfo: {
			titleKey: "app.services.laser_body_title@@Laser hair removal BODY",
			titleDefault: "Laser hair removal BODY",
			descKey:
				"app.services.laser_desc@@Safe, effective, and painless technology for smooth skin.",
			descDefault: "Safe, effective, and painless technology for smooth skin.",
		},
	},
	"laser-combo": {
		keywords: [
			"COMBO",
			"KOMBO",
			"FULL BODY",
			"SET",
			"PACKAGE",
			"PAQUET",
			"PAK",
			"ПАКЕТ",
			"КОМПЛЕКСИ",
			"КОМПЛЕКСЫ",
		],
		coverImage: "/media/services/laser-combo.png",
		displayInfo: {
			titleKey: "app.services.laser_combo_title@@Laser hair removal COMBO",
			titleDefault: "Laser hair removal COMBO",
			descKey:
				"app.services.laser_desc@@Safe, effective, and painless technology for smooth skin.",
			descDefault: "Safe, effective, and painless technology for smooth skin.",
		},
	},
	"laser-male": {
		keywords: [
			"MALE",
			"MEN",
			"MAN",
			"HOMME",
			"MASCULIN",
			"MANNEN",
			"HEREN",
			"МУЖСКОЙ",
			"МУЖЧИН",
			"ЧОЛОВІЧИЙ",
			"ЧОЛОВІКИ",
		],
		coverImage: "/media/services/laser-male.png",
		displayInfo: {
			titleKey: "app.services.laser_male_title@@Laser hair removal MALE",
			titleDefault: "Laser hair removal MALE",
			descKey:
				"app.services.laser_desc@@Safe, effective, and painless technology for smooth skin.",
			descDefault: "Safe, effective, and painless technology for smooth skin.",
		},
	},
	universal: {
		keywords: [],
		coverImage: "/media/gallery/universal.jpg",
		displayInfo: {
			descKey:
				"app.services.general_desc@@Professional beauty treatments for your refined look.",
			descDefault: "Professional beauty treatments for your refined look.",
		},
	},
};

export interface GroupedServiceData {
	groupId: string;
	realGroupId: string;
	variant?: string; // "face" | "body" | "combo"
	theme: ServiceTheme;
	groupServices: Service[];
	category: ServiceGroup | undefined;
	priority: number;
	displayTitleKey?: string;
	displayTitleDefault?: string;
	displayDescriptionKey?: string;
	displayDescriptionDefault?: string;
	coverImage: string;
}

// ============================================================================
// Helpers
// ============================================================================

function matchesKeywords(
	keywords: string[],
	text1: string,
	text2: string,
): boolean {
	return keywords.some((k) => text1.includes(k) || text2.includes(k));
}

// ============================================================================
// Classification Logic
// ============================================================================

/**
 * Determines the 'theme' of a service or category based on keywords.
 * Used for selecting images and grouping logic.
 */
export function getServiceTheme(
	categoryName: string = "",
	serviceName: string = "",
): ServiceTheme {
	const cName = categoryName.toLowerCase();
	const sName = serviceName.toLowerCase();
	const sNameUpper = serviceName.toUpperCase();

	// Check generic categories first
	if (matchesKeywords(THEME_DEFINITIONS.pedicure.keywords, cName, sName))
		return "pedicure";
	if (matchesKeywords(THEME_DEFINITIONS.manicure.keywords, cName, sName))
		return "manicure";
	if (matchesKeywords(THEME_DEFINITIONS.brows_lashes.keywords, cName, sName))
		return "brows_lashes";
	if (matchesKeywords(THEME_DEFINITIONS.removal.keywords, "", sName))
		return "removal";

	// Laser check
	const isLaser =
		cName.includes("laser") ||
		cName.includes("лазер") ||
		cName.includes("эпиля") ||
		sName.includes("laser") ||
		sName.includes("lazer");

	if (isLaser) {
		const cNameUpper = categoryName.toUpperCase();
		// Check Category Name AND Service Name for sub-themes
		// using UPPERCASE for both because keywords are uppercase
		if (
			matchesKeywords(
				THEME_DEFINITIONS["laser-face"].keywords,
				cNameUpper,
				sNameUpper,
			)
		)
			return "laser-face";
		if (
			matchesKeywords(
				THEME_DEFINITIONS["laser-combo"].keywords,
				cNameUpper,
				sNameUpper,
			)
		)
			return "laser-combo";
		if (
			matchesKeywords(
				THEME_DEFINITIONS["laser-male"].keywords,
				cNameUpper,
				sNameUpper,
			)
		)
			return "laser-male";
		return "laser-body";
	}

	return "universal";
}

// ============================================================================
// Image Logic
// ============================================================================

export function getCategoryCoverImage(theme: ServiceTheme): string {
	return (
		THEME_DEFINITIONS[theme]?.coverImage ??
		THEME_DEFINITIONS.universal.coverImage
	);
}

export function getServiceItemImage(
	theme: ServiceTheme,
	index: number,
): string {
	const def = THEME_DEFINITIONS[theme] || THEME_DEFINITIONS.universal;

	// If no dynamic gallery base, fallback to cover image
	if (!def.galleryBase) {
		return def.coverImage;
	}

	// Handle static single images mapped as galleryBase (legacy support or explicit single file)
	if (def.galleryBase.endsWith(".jpg") || def.galleryBase.endsWith(".png")) {
		return def.galleryBase;
	}

	// Dynamic variant
	// Use the configured imageCount or default to 5 (legacy default)
	const count = def.imageCount ?? 5;
	const variant = (index % count) + 1;
	return `${def.galleryBase}${variant}.jpg`;
}

// ============================================================================
// Display Text Logic
// ============================================================================

export function getThemeDisplayInfo(theme: ServiceTheme) {
	return (
		THEME_DEFINITIONS[theme]?.displayInfo ??
		THEME_DEFINITIONS.universal.displayInfo
	);
}

// ============================================================================
// Grouping Logic
// ============================================================================

export function groupServicesAndCategories(
	services: Service[],
	categories: ServiceGroup[],
): GroupedServiceData[] {
	const groupsMap: Record<string, Service[]> = {};

	// 1. Bucket services by strict group_id (matching /pricelist)
	for (const service of services) {
		const key = String(service.group_id);
		if (!groupsMap[key]) groupsMap[key] = [];
		groupsMap[key].push(service);
	}

	// 2. Transform to View Models
	const result = Object.entries(groupsMap).map(([groupId, groupServices]) => {
		const category = categories.find((c) => String(c.id) === String(groupId));
		const categoryName = category?.name || "";

		// Determine theme purely for visual assets (Image key)
		// We trust the DB category name mainly, but can fallback to checking services if needed
		// But to match Pricelist, we should rely on Category Name as primary source of truth.
		const theme = getServiceTheme(categoryName, "");

		const def = THEME_DEFINITIONS[theme] || THEME_DEFINITIONS.universal;

		// Sort services: Price (Low -> High) to match Pricelist
		groupServices.sort((a, b) => a.price - b.price);

		return {
			groupId, // Original DB ID
			realGroupId: groupId,
			variant: undefined, // No longer fabricating variants
			theme,
			groupServices,
			category,
			priority: category?.priority ?? 0, // Trust DB priority
			displayTitleKey: def.displayInfo.titleKey,
			displayTitleDefault: def.displayInfo.titleDefault,
			displayDescriptionKey: def.displayInfo.descKey,
			displayDescriptionDefault: def.displayInfo.descDefault,
			// Allow overriding image if category name suggests it
			coverImage: def.coverImage,
		};
	});

	// 3. Sort groups by category priority
	return result.sort((a, b) => b.priority - a.priority);
}
