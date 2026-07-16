import { component$ } from "@builder.io/qwik";
import { isDev } from "@builder.io/qwik/build";
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { useQwikSpeak, useSpeakLocale } from "qwik-speak";
import { GoogleAnalytics } from "./components/ui/google-analytics";
import { JSON_LD } from "./constants/metadata";
import { getGoogleAnalyticsBootstrapScript } from "./shared/cookie-consent";
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
	const locale = useSpeakLocale();
	return (
		<QwikCityProvider>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<script
					dangerouslySetInnerHTML={
						'document.documentElement.classList.add("js");'
					}
				/>

				<link
					rel="preload"
					href="/fonts/montserrat-var.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/QESTERO-Regular.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				{!isDev && (
					<script
						dangerouslySetInnerHTML={getGoogleAnalyticsBootstrapScript()}
					/>
				)}
				{!isDev && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={JSON.stringify(JSON_LD)}
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
			<body lang={locale.lang} data-theme="Aesthetic" class="font-montserrat">
				{!isDev && <GoogleAnalytics />}
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
