import { getLocale, withLocale } from "@qwik.dev/core";
import type { DocumentHeadProps, DocumentHeadValue } from "@qwik.dev/router";
import { config, isSupportedLocale } from "~/i18n-config";

/**
 * Current request/document locale (e.g. `nl-BE`).
 *
 * During SSR this is the locale set by `src/routes/plugin.ts`; in the browser
 * Qwik reads it from the container's `q:locale` attribute.
 */
export const getCurrentLocale = (): string =>
	getLocale(config.defaultLocale.lang);

/**
 * Runs a route's `head` function in the route's locale.
 *
 * Qwik Router 2.0.0-rc.0 resolves `head` inside a tracking context that has no
 * locale (`getLocale("")`), so compiled-i18n would fall back to the default
 * locale for titles and meta descriptions. `withLocale` is request-scoped
 * (AsyncLocalStorage) on the server.
 */
export const localizeHead =
	(resolve: (props: DocumentHeadProps) => DocumentHeadValue) =>
	(props: DocumentHeadProps): DocumentHeadValue => {
		const lang = props.params.lang;
		return withLocale(
			isSupportedLocale(lang) ? lang : config.defaultLocale.lang,
			() => resolve(props),
		);
	};
