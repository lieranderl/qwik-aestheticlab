import type { Service, ServiceGroup } from "~/types";

type LocaleCode = "en" | "ru" | "nl" | "fr" | "uk";

type LocalizedFieldSet = {
	defaultValue: string;
	ru: string;
	nl: string;
	fr: string;
	uk: string;
};

export interface LocalizableServiceGroup {
	id: string;
	name: string;
	name_en?: string;
	name_ru: string;
	name_nl: string;
	name_fr: string;
	name_uk: string;
	priority: number;
}

export interface LocalizableService {
	id: string;
	group_id: string;
	name: string;
	name_ru: string;
	name_nl: string;
	name_fr: string;
	name_uk: string;
	description: string;
	description_ru: string;
	description_nl: string;
	description_fr: string;
	description_uk: string;
	duration: number;
	price: number;
}

const SUPPORTED_LOCALE_CODES = new Set<LocaleCode>([
	"en",
	"ru",
	"nl",
	"fr",
	"uk",
]);

export function getLocaleCode(locale: string): LocaleCode {
	const normalized = locale.split("-")[0]?.toLowerCase() as
		| LocaleCode
		| undefined;

	if (normalized && SUPPORTED_LOCALE_CODES.has(normalized)) {
		return normalized;
	}

	return "en";
}

function resolveLocalizedField(
	localeCode: LocaleCode,
	{ defaultValue, ru, nl, fr, uk }: LocalizedFieldSet,
) {
	switch (localeCode) {
		case "ru":
			return ru || defaultValue;
		case "nl":
			return nl || defaultValue;
		case "fr":
			return fr || defaultValue;
		case "uk":
			return uk || defaultValue;
		default:
			return defaultValue;
	}
}

export function localizeServiceGroup(
	group: LocalizableServiceGroup,
	locale: string,
): ServiceGroup {
	const localeCode = getLocaleCode(locale);
	const englishName = group.name_en ?? group.name;

	return {
		id: group.id,
		name: resolveLocalizedField(localeCode, {
			defaultValue: englishName,
			ru: group.name_ru,
			nl: group.name_nl,
			fr: group.name_fr,
			uk: group.name_uk,
		}),
		name_en: englishName,
		priority: group.priority,
	};
}

export function localizeService(
	service: LocalizableService,
	locale: string,
): Service {
	const localeCode = getLocaleCode(locale);

	return {
		id: service.id,
		group_id: service.group_id,
		name: resolveLocalizedField(localeCode, {
			defaultValue: service.name,
			ru: service.name_ru,
			nl: service.name_nl,
			fr: service.name_fr,
			uk: service.name_uk,
		}),
		description: resolveLocalizedField(localeCode, {
			defaultValue: service.description,
			ru: service.description_ru,
			nl: service.description_nl,
			fr: service.description_fr,
			uk: service.description_uk,
		}),
		duration: service.duration,
		price: service.price,
	};
}

export function localizeServiceGroups(
	groups: LocalizableServiceGroup[] | null | undefined,
	locale: string,
): ServiceGroup[] {
	if (!groups?.length) return [];
	return groups.map((group) => localizeServiceGroup(group, locale));
}

export function localizeServices(
	services: LocalizableService[] | null | undefined,
	locale: string,
): Service[] {
	if (!services?.length) return [];
	return services.map((service) => localizeService(service, locale));
}
