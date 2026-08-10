export const SITE_METADATA = {
	name: "Aesthetic Lab",
	url: "https://aestheticlab.be",
	email: "aestheticlabbe@gmail.com",
	address: {
		street: "Diestsestraat 174",
		city: "Leuven",
		zip: "3000",
		country: "BE",
	},
	geo: {
		latitude: 50.88148,
		longitude: 4.71053,
	},
	socials: {
		instagram: "https://www.instagram.com/aestheticlabbe",
	},
	pricing: "€€",
	hours: [
		{
			days: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			],
			opens: "10:00",
			closes: "18:00",
		},
	],
	images: {
		main: "https://lh3.googleusercontent.com/p/AF1QipOpUazRD7FPPGNWPbIYA8Fyf7vn0fUdm2bBkQDx",
	},
};

export const JSON_LD = {
	"@context": "https://schema.org",
	"@type": "BeautySalon",
	"@id": `${SITE_METADATA.url}#salon`,
	name: SITE_METADATA.name,
	image: SITE_METADATA.images.main,
	url: SITE_METADATA.url,
	email: SITE_METADATA.email,
	address: {
		"@type": "PostalAddress",
		streetAddress: SITE_METADATA.address.street,
		addressLocality: SITE_METADATA.address.city,
		postalCode: SITE_METADATA.address.zip,
		addressCountry: SITE_METADATA.address.country,
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: SITE_METADATA.geo.latitude,
		longitude: SITE_METADATA.geo.longitude,
	},
	hasMap: `https://maps.google.com/?q=${encodeURIComponent(
		`${SITE_METADATA.address.street}, ${SITE_METADATA.address.zip} ${SITE_METADATA.address.city}, ${SITE_METADATA.address.country}`,
	)}`,
	openingHoursSpecification: SITE_METADATA.hours.map((h) => ({
		"@type": "OpeningHoursSpecification",
		dayOfWeek: h.days,
		opens: h.opens,
		closes: h.closes,
	})),
	priceRange: SITE_METADATA.pricing,
	sameAs: [SITE_METADATA.socials.instagram],
};
