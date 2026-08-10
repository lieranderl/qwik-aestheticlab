import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { SITE_METADATA } from "~/constants/metadata";
import { config } from "~/speak-config";

function getLocalizedUrl(locale: string, routeSegments: string[]) {
	return `${SITE_METADATA.url}/${[locale, ...routeSegments].join("/")}/`;
}

export function getLocalizedSeoLinks(pathname: string) {
	const segments = pathname.split("/").filter(Boolean);
	const hasLocalePrefix = config.supportedLocales.some(
		(locale) => locale.lang === segments[0],
	);
	const routeSegments = hasLocalePrefix ? segments.slice(1) : segments;

	return {
		canonical: `${SITE_METADATA.url}${pathname}`,
		alternates: config.supportedLocales.map((locale) => ({
			hrefLang: locale.lang,
			href: getLocalizedUrl(locale.lang, routeSegments),
		})),
		xDefault: getLocalizedUrl(config.defaultLocale.lang, routeSegments),
	};
}

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
	const head = useDocumentHead();
	const loc = useLocation();
	const seoLinks = getLocalizedSeoLinks(loc.url.pathname);

	return (
		<>
			<title>{head.title}</title>

			<link rel="canonical" href={seoLinks.canonical} />
			{seoLinks.alternates.map((alternate) => (
				<link
					key={alternate.hrefLang}
					rel="alternate"
					hreflang={alternate.hrefLang}
					href={alternate.href}
				/>
			))}
			<link rel="alternate" hreflang="x-default" href={seoLinks.xDefault} />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<link rel="apple-touch-icon" href="/icon-192.svg" />
			<meta name="theme-color" content="#8b9687" />

			{head.meta.map((m) => (
				<meta key={m.key} {...m} />
			))}

			{head.links.map((l) => (
				<link key={l.key} {...l} />
			))}

			{head.styles.map((s) => (
				<style
					key={s.key}
					{...s.props}
					{...(s.props?.dangerouslySetInnerHTML
						? {}
						: { dangerouslySetInnerHTML: s.style })}
				/>
			))}

			{head.scripts.map((s) => (
				<script
					key={s.key}
					{...s.props}
					{...(s.props?.dangerouslySetInnerHTML
						? {}
						: { dangerouslySetInnerHTML: s.script })}
				/>
			))}
		</>
	);
});
