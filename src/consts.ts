export const formatPrice = (price: number, locale = "en-BE") => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: price % 1 === 0 ? 0 : 2,
	}).format(price);
};

export const gaMeasurementId = "G-95QF984DPQ";

export const formatPremiumPrice = (price: number, locale = "en-BE") =>
	formatPrice(price, locale);

export const baseUrlBooking =
	"https://bookings.gettimely.com/aestheticlab2/bb/book";

export const bookingLocationId = "372146";

/** Google Business rating shown in the hero and reviews; update when it changes.
 * `googlePlaceUrl` opens the studio on Google Maps (reviews and directions). */
export const googleRating = "5.0";
export const googleReviewCount = 60;
export const googlePlaceUrl = "https://maps.app.goo.gl/bsdNssGY4YTJeR7j6";
