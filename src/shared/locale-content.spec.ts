import { describe, expect, it } from "vitest";
import {
	getLocaleCode,
	type LocalizableService,
	type LocalizableServiceGroup,
	localizeService,
	localizeServiceGroup,
	localizeServiceGroups,
	localizeServices,
} from "./locale-content";

const baseGroup: LocalizableServiceGroup = {
	id: "group-1",
	name: "Manicure",
	name_en: "Manicure",
	name_ru: "Маникюр",
	name_nl: "Manicure NL",
	name_fr: "Manucure",
	name_uk: "Манікюр",
	priority: 10,
};

const baseService: LocalizableService = {
	id: "service-1",
	group_id: "group-1",
	name: "Classic manicure",
	name_ru: "Классический маникюр",
	name_nl: "Klassieke manicure",
	name_fr: "Manucure classique",
	name_uk: "Класичний манікюр",
	description: "English description",
	description_ru: "Русское описание",
	description_nl: "Nederlandse beschrijving",
	description_fr: "Description francaise",
	description_uk: "Український опис",
	duration: 60,
	price: 50,
};

describe("getLocaleCode", () => {
	it("returns supported locale codes", () => {
		expect(getLocaleCode("fr-BE")).toBe("fr");
		expect(getLocaleCode("uk-BE")).toBe("uk");
	});

	it("falls back to english for unsupported locales", () => {
		expect(getLocaleCode("es-BE")).toBe("en");
		expect(getLocaleCode("")).toBe("en");
	});
});

describe("localizeServiceGroup", () => {
	it("uses the locale-specific group name and preserves english name", () => {
		const localized = localizeServiceGroup(baseGroup, "ru-BE");

		expect(localized.name).toBe("Маникюр");
		expect(localized.name_en).toBe("Manicure");
	});

	it("falls back to english name for unsupported locales", () => {
		const localized = localizeServiceGroup(baseGroup, "de-BE");

		expect(localized.name).toBe("Manicure");
		expect(localized.name_en).toBe("Manicure");
	});
});

describe("localizeService", () => {
	it("uses locale-specific name and description", () => {
		const localized = localizeService(baseService, "nl-BE");

		expect(localized.name).toBe("Klassieke manicure");
		expect(localized.description).toBe("Nederlandse beschrijving");
	});

	it("falls back to english fields for unsupported locales", () => {
		const localized = localizeService(baseService, "de-BE");

		expect(localized.name).toBe("Classic manicure");
		expect(localized.description).toBe("English description");
	});

	it("falls back to default (English) values when translation strings are empty", () => {
		const emptyStringService: LocalizableService = {
			...baseService,
			name_nl: "",
			description_nl: "",
		};
		const localized = localizeService(emptyStringService, "nl-BE");

		expect(localized.name).toBe("Classic manicure");
		expect(localized.description).toBe("English description");
	});
});

describe("localizeServiceGroups", () => {
	it("returns localized groups for supported locales", () => {
		expect(localizeServiceGroups([baseGroup], "fr-BE")).toEqual([
			expect.objectContaining({
				id: "group-1",
				name: "Manucure",
				name_en: "Manicure",
			}),
		]);
	});

	it("returns an empty array for nullish or empty inputs", () => {
		expect(localizeServiceGroups([], "en-BE")).toEqual([]);
		expect(localizeServiceGroups(null, "en-BE")).toEqual([]);
		expect(localizeServiceGroups(undefined, "en-BE")).toEqual([]);
	});
});

describe("localizeServices", () => {
	it("returns localized services for supported locales", () => {
		expect(localizeServices([baseService], "uk-BE")).toEqual([
			expect.objectContaining({
				id: "service-1",
				name: "Класичний манікюр",
				description: "Український опис",
			}),
		]);
	});

	it("returns an empty array for nullish or empty inputs", () => {
		expect(localizeServices([], "en-BE")).toEqual([]);
		expect(localizeServices(null, "en-BE")).toEqual([]);
		expect(localizeServices(undefined, "en-BE")).toEqual([]);
	});
});
