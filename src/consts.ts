export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		//  do not show cents if price is a whole number
		minimumFractionDigits: price % 1 === 0 ? 0 : 2,
	}).format(price);
};

export const ga = [
	// Google Analytics Script (External)
	{
		props: {
			type: "text/javascript",
			src: "https://www.googletagmanager.com/gtag/js?id=G-95QF984DPQ",
			async: true,
		},
	},
	// Inline Google Analytics Setup Script
	{
		script: `
       	window.dataLayer = window.dataLayer || [];
  	 	function gtag(){dataLayer.push(arguments);}
  		gtag('js', new Date());
  		gtag('config', 'G-95QF984DPQ');
      `,
	},
];

export const baseUrlBooking =
	"https://bookings.gettimely.com/aestheticlab2/bb/book";
