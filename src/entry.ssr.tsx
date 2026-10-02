import { getLocale } from "@builder.io/qwik";
import { isDev } from "@builder.io/qwik/build";
import {
	type RenderOptions,
	type RenderToStreamOptions,
	renderToStream,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import { setLocaleGetter } from "compiled-i18n";
import { config } from "./i18n-config";
import Root from "./root";

// compiled-i18n resolves the locale per translation from Qwik's request context.
setLocaleGetter(() => getLocale(config.defaultLocale.lang));

function extractBase({ serverData }: RenderOptions): string {
	return !isDev && serverData?.locale
		? `/build/${serverData.locale}`
		: "/build";
}

export default function (opts: RenderToStreamOptions) {
	const { serverData, containerAttributes } = opts;

	return renderToStream(<Root />, {
		manifest,
		...opts,
		base: extractBase,
		containerAttributes: {
			lang: serverData?.locale || config.defaultLocale.lang,
			...containerAttributes,
		},
	});
}
