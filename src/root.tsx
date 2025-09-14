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
				<script type="application/ld+json">{`
					{
					"@context": "https://schema.org",
					"@type": "BeautySalon",
					"name": "Aesthetic Lab",
					"address": {
						"@type": "PostalAddress",
						"addressLocality": "Leuven",
						"addressCountry": "BE"
					},
					"url": "https://aestheticlab.be"
					}
					`}</script>

					<script id="timelyScript" src="//book.gettimely.com/widget/book-button-v1.5.js"></script>

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
