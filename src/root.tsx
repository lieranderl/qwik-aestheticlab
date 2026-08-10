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
						'document.documentElement.classList.add("js","scroll-smooth");'
					}
				/>

				{!isDev && (
					<>
						<script
							dangerouslySetInnerHTML={getGoogleAnalyticsBootstrapScript()}
						/>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={JSON.stringify(JSON_LD)}
						/>
						<link
							rel="manifest"
							href={`${import.meta.env.BASE_URL}manifest.json`}
						/>
					</>
				)}
				<RouterHead />
				{!isDev && <ServiceWorkerRegister />}
			</head>
			<body
				lang={locale.lang}
				data-theme="Aesthetic"
				class="relative min-w-80 scroll-smooth bg-base-200 font-main text-base-content antialiased scrollbar-thin [scrollbar-color:var(--color-base-300)_transparent]"
			>
				{!isDev && <GoogleAnalytics />}
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
