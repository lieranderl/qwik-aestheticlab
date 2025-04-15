/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
	type RenderOptions,
	renderToStream,
	type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";
import { isDev } from "@builder.io/qwik/build";
import { config } from "./speak-config";

export function extractBase({ serverData }: RenderOptions): string {
	if (!isDev && serverData?.locale) {
		return `/build/${serverData.locale}`;
	}
	return "/build";
}

export default function (opts: RenderToStreamOptions) {
	return renderToStream(<Root />, {
		manifest,
		...opts,
		// Determine the base URL for the client code
		base: extractBase,
		// Use container attributes to set attributes on the html tag
		containerAttributes: {
			lang: opts.serverData?.locale || config.defaultLocale.lang,
			...opts.containerAttributes,
		},
	});
}
