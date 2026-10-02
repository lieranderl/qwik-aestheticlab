import { component$, useStyles$ } from "@qwik.dev/core";
import { isDev } from "@qwik.dev/core/build";
import {
	QwikRouterProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@qwik.dev/router";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { GoogleAnalytics } from "./components/ui/google-analytics";
import { JSON_LD } from "./constants/metadata";
import { getGoogleAnalyticsBootstrapScript } from "./shared/cookie-consent";
import { getCurrentLocale } from "./shared/i18n";

export default component$(() => {
	useStyles$(`:root{view-transition-name:none}`);
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Don't remove the `<head>` and `<body>` elements.
	 */
	return (
		<QwikRouterProvider viewTransition={true}>
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
				lang={getCurrentLocale()}
				data-theme="Aesthetic"
				class="relative min-w-80 scroll-smooth bg-base-200 font-main text-base-content antialiased scrollbar-thin [scrollbar-color:var(--color-base-300)_transparent]"
			>
				{!isDev && <GoogleAnalytics />}
				<RouterOutlet />
			</body>
		</QwikRouterProvider>
	);
});
