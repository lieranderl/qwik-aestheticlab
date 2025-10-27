import { component$ } from "@builder.io/qwik";
import { isDev } from "@builder.io/qwik/build";
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { useQwikSpeak } from "qwik-speak";
import { config } from "./speak-config";
import { translationFn } from "./speak-functions";

export default component$(() => {
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Don't remove the `<head>` and `<body>` elements.
	 */
	useQwikSpeak({ config, translationFn });
	return (
		<QwikCityProvider>
			<head>
				<meta charset="utf-8" />

				{!isDev && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BeautySalon",
							"@id": "https://aestheticlab.be#salon",
							name: "Aesthetic Lab",
							image:
								"https://lh3.googleusercontent.com/p/AF1QipOpUazRD7FPPGNWPbIYA8Fyf7vn0fUdm2bBkQDx",
							url: "https://aestheticlab.be",
							email: "aestheticlabbe@gmail.com",
							address: {
								"@type": "PostalAddress",
								streetAddress: "Diestsestraat 174",
								addressLocality: "Leuven",
								postalCode: "3000",
								addressCountry: "BE",
							},
							geo: {
								"@type": "GeoCoordinates",
								latitude: 50.88148,
								longitude: 4.71053,
							},
							hasMap:
								"https://maps.google.com/?q=Diestsestraat+174,+3000+Leuven,+Belgium",
							openingHoursSpecification: [
								{
									"@type": "OpeningHoursSpecification",
									dayOfWeek: [
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
							priceRange: "€€",
							sameAs: ["https://www.instagram.com/aestheticlabbe"],
						})}
					/>
				)}

				{!isDev && (
					<link
						rel="manifest"
						href={`${import.meta.env.BASE_URL}manifest.json`}
					/>
				)}
				<RouterHead />
				{!isDev && <ServiceWorkerRegister />}
			</head>
			<body lang="en" class="font-montserrat">
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
