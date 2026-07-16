import type { Contact, Service, ServiceGroup, Staff } from "~/types";
import {
	getLocaleCode,
	type LocalizableService,
	type LocalizableServiceGroup,
	localizeService,
	localizeServiceGroup,
} from "./locale-content";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
	return value !== null && typeof value === "object" && !Array.isArray(value)
		? (value as UnknownRecord)
		: null;
}

function readString(record: UnknownRecord, key: string) {
	const value = record[key];
	return typeof value === "string" ? value.trim() : "";
}

function readFiniteNumber(record: UnknownRecord, key: string) {
	const value = record[key];
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readIdentifier(record: UnknownRecord, key: string) {
	const value = record[key];
	if (typeof value === "string" && value.trim()) return value.trim();
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return "";
}

function readExternalUrl(record: UnknownRecord, key: string) {
	const value = readString(record, key);
	if (!value) return "";

	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:" ? value : "";
	} catch {
		return "";
	}
}

function parseServiceGroup(value: unknown): LocalizableServiceGroup | null {
	const row = asRecord(value);
	if (!row) return null;

	const id = readIdentifier(row, "id");
	const name = readString(row, "name");
	const priority = readFiniteNumber(row, "priority");
	if (!id || !name || priority === null) return null;

	return {
		id,
		name,
		name_en: readString(row, "name_en") || name,
		name_ru: readString(row, "name_ru"),
		name_nl: readString(row, "name_nl"),
		name_fr: readString(row, "name_fr"),
		name_uk: readString(row, "name_uk"),
		priority,
	};
}

function parseService(value: unknown): LocalizableService | null {
	const row = asRecord(value);
	if (!row) return null;

	const id = readIdentifier(row, "id");
	const groupId = readIdentifier(row, "group_id");
	const name = readString(row, "name");
	const description = readString(row, "description");
	const duration = readFiniteNumber(row, "duration");
	const price = readFiniteNumber(row, "price");
	if (!id || !groupId || !name || duration === null || price === null) {
		return null;
	}

	return {
		id,
		group_id: groupId,
		name,
		name_ru: readString(row, "name_ru"),
		name_nl: readString(row, "name_nl"),
		name_fr: readString(row, "name_fr"),
		name_uk: readString(row, "name_uk"),
		description,
		description_ru: readString(row, "description_ru"),
		description_nl: readString(row, "description_nl"),
		description_fr: readString(row, "description_fr"),
		description_uk: readString(row, "description_uk"),
		duration,
		price,
	};
}

export function projectServiceGroups(
	value: unknown,
	locale: string,
): ServiceGroup[] {
	if (!Array.isArray(value)) return [];

	return value.flatMap((row) => {
		const parsed = parseServiceGroup(row);
		return parsed ? [localizeServiceGroup(parsed, locale)] : [];
	});
}

export function projectServices(value: unknown, locale: string): Service[] {
	if (!Array.isArray(value)) return [];

	return value.flatMap((row) => {
		const parsed = parseService(row);
		return parsed ? [localizeService(parsed, locale)] : [];
	});
}

export function projectStaff(value: unknown, locale: string): Staff[] {
	if (!Array.isArray(value)) return [];
	const localeCode = getLocaleCode(locale);

	return value.flatMap((value) => {
		const row = asRecord(value);
		if (!row) return [];

		const id = readFiniteNumber(row, "id");
		const name = readString(row, "name");
		if (id === null || !name) return [];

		const englishAbout = readString(row, "about");
		const localizedAbout =
			localeCode === "en"
				? englishAbout
				: readString(row, `about_${localeCode}`) || englishAbout;

		return [
			{
				id,
				name,
				photo_url: readString(row, "photo_url"),
				about: localizedAbout,
				role: readString(row, "role"),
			},
		];
	});
}

export function projectContact(value: unknown): Contact | null {
	const row = asRecord(value);
	const openHours = asRecord(row?.open_hours);
	const location = asRecord(row?.location);
	if (!row || !openHours || !location) return null;

	const email = readString(row, "email");
	const locationName = readString(location, "name");
	const address = readString(location, "address");
	const locationLink = readExternalUrl(location, "link");
	const from = readString(openHours, "from");
	const to = readString(openHours, "to");
	if (!email || !locationName || !address || !locationLink || !from || !to) {
		return null;
	}

	const parking = Array.isArray(row.parking)
		? row.parking.flatMap((value) => {
				const parkingRow = asRecord(value);
				if (!parkingRow) return [];
				const name = readString(parkingRow, "name");
				const link = readExternalUrl(parkingRow, "link");
				return name && link ? [{ name, link }] : [];
			})
		: [];

	return {
		email,
		open_hours: {
			start_week_day: readString(openHours, "start_week_day"),
			end_week_day: readString(openHours, "end_week_day"),
			from,
			to,
		},
		location: {
			name: locationName,
			address,
			link: locationLink,
		},
		parking,
	};
}
