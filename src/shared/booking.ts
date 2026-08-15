import { bookingLocationId } from "~/consts";

export function resolveBookingLocation(location?: string) {
	return location?.trim() || bookingLocationId;
}
