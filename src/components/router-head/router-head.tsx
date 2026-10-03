import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
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
	const t = inlineTranslate();
	const head = useDocumentHead();
	const loc = useLocation();
	const seoLinks = getLocalizedSeoLinks(loc.url.pathname);
	const description =
		head.meta.find((meta) => meta.name === "description")?.content ?? "";
	const lang =
		config.supportedLocales.find(
			(locale) => loc.url.pathname.split("/")[1] === locale.lang,
		)?.lang ?? config.defaultLocale.lang;
	const ogLocale = lang.replace("-", "_");
	// One 1200 × 630 image per language (rendered by scripts/share-images.ts).
	const shareImage = `${SITE_METADATA.url}/og/${lang}.jpg`;
	const shareImageAlt = t(
		"app.head.share_alt@@Aesthetic Lab, Leuven: a glossy taupe manicure in soft foam",
	);

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

			{/* Link previews in WhatsApp, Instagram, Messenger, etc. */}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_METADATA.name} />
			<meta property="og:title" content={head.title} />
			{description ? (
				<meta property="og:description" content={description} />
			) : null}
			<meta property="og:url" content={seoLinks.canonical} />
			<meta property="og:locale" content={ogLocale} />
			{config.supportedLocales
				.filter((locale) => locale.lang !== lang)
				.map((locale) => (
					<meta
						key={locale.lang}
						property="og:locale:alternate"
						content={locale.lang.replace("-", "_")}
					/>
				))}
			<meta property="og:image" content={shareImage} />
			<meta property="og:image:type" content="image/jpeg" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={shareImageAlt} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={head.title} />
			{description ? (
				<meta name="twitter:description" content={description} />
			) : null}
			<meta name="twitter:image" content={shareImage} />
			<meta name="twitter:image:alt" content={shareImageAlt} />

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
