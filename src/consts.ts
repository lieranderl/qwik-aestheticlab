export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		//  do not show cents if price is a whole number
		minimumFractionDigits: price % 1 === 0 ? 0 : 2,
	}).format(price);
};

export const gaMeasurementId = "G-95QF984DPQ";

export const baseUrlBooking =
	"https://bookings.gettimely.com/aestheticlab2/bb/book";
