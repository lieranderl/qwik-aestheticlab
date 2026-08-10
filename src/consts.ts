export const formatPrice = (price: number, locale = "de-DE") => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: price % 1 === 0 ? 0 : 2,
	}).format(price);
};

export const gaMeasurementId = "G-95QF984DPQ";

export const formatPremiumPrice = (price: number) =>
	formatPrice(price, "fr-BE");

export const baseUrlBooking =
	"https://bookings.gettimely.com/aestheticlab2/bb/book";

export const bookingLocationId = "372146";
