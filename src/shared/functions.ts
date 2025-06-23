import { server$ } from "@builder.io/qwik-city";
import { DateTime } from "luxon";
import type { Technician, TimeSlot } from "~/types";

export function generate15MinTimeSlots(
	baseDate: string,
	timezoneOffset: string = "+02:00",
): TimeSlot[] {
	const slots: TimeSlot[] = [];
	let current = DateTime.fromISO(baseDate, { zone: timezoneOffset }).set({
		hour: 9,
		minute: 0,
		second: 0,
		millisecond: 0,
	});
	const end = DateTime.fromISO(baseDate, { zone: timezoneOffset }).set({
		hour: 19,
		minute: 0,
		second: 0,
		millisecond: 0,
	});

	while (current < end) {
		const slotStart = current;
		const slotEnd = current.plus({ minutes: 15 });
		slots.push({
			start: slotStart.toISO() || "",
			end: slotEnd.toISO() || "",
			status: "available",
		});
		current = slotEnd;
	}
	console.log("Generated 15-min time slots:", slots);
	return slots;
}

export const fetchTechnicianSlots = server$(
	async (params: {
		api_base_url: string;
		api_token: string;
		tech: Technician;
		date: string;
		weekday: string;
		duration: string;
	}) => {
		const { api_base_url, api_token, tech, date, weekday, duration } = params;

		try {
			const url = `${api_base_url}/calendar/technician/${tech.id}?date=${date}&weekday=${weekday}&slot_duration=${duration}`;
			const response = await fetch(url, {
				headers: { Authorization: `${api_token}` },
			});
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			const slots: TimeSlot[] = await response.json();
			return !slots.length || slots.every((s) => Object.keys(s).length === 0)
				? null
				: { tech, slots };
		} catch (error) {
			console.error("Failed to fetch technician slots:", error);
			return null;
		}
	},
);
