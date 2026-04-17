import type { Service, ServiceGroup } from "~/types";

type LocaleCode = "en" | "ru" | "nl" | "fr" | "uk";

type LocalizedFieldSet = {
	defaultValue: string;
	ru: string;
	nl: string;
	fr: string;
	uk: string;
};

type LocalizableServiceGroup = Omit<ServiceGroup, "name_en"> &
	Partial<Pick<ServiceGroup, "name_en">>;

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
			return ru ?? defaultValue;
		case "nl":
			return nl ?? defaultValue;
		case "fr":
			return fr ?? defaultValue;
		case "uk":
			return uk ?? defaultValue;
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
		...group,
		name: resolveLocalizedField(localeCode, {
			defaultValue: englishName,
			ru: group.name_ru,
			nl: group.name_nl,
			fr: group.name_fr,
			uk: group.name_uk,
		}),
		name_en: englishName,
	};
}

export function localizeService(service: Service, locale: string): Service {
	const localeCode = getLocaleCode(locale);

	return {
		...service,
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
	services: Service[] | null | undefined,
	locale: string,
): Service[] {
	if (!services?.length) return [];

	return services.map((service) => localizeService(service, locale));
}
