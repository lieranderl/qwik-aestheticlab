import { getClientManifest, getLocale } from "@qwik.dev/core";
import { isDev } from "@qwik.dev/core/build";
import {
	type RenderOptions,
	type RenderToStreamOptions,
	renderToStream,
} from "@qwik.dev/core/server";
import { setLocaleGetter } from "compiled-i18n";
import { config } from "./i18n-config";
import Root from "./root";

const manifest = getClientManifest();

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
		streaming: {
			...opts.streaming,
			inOrder: {
				strategy: "auto",
				maximumInitialChunk: 50000,
				maximumChunk: 30000,
			},
		},
	});
}
