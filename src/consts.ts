export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		//  do not show cents if price is a whole number
		minimumFractionDigits: price % 1 === 0 ? 0 : 2,
	}).format(price);
};

export const formatPremiumPrice = (price: number) => {
	const formattedPrice = formatPrice(price).replace(/\u00a0/g, " ");
	const amount = formattedPrice.replace(/\s*€$/, "");
	const englishAmount = amount.replace(/\./g, ",").replace(/,(\d{2})$/, ".$1");
	return `€${englishAmount}`;
};

export const gaMeasurementId = "G-95QF984DPQ";

export const baseUrlBooking =
	"https://bookings.gettimely.com/aestheticlab2/bb/book";
