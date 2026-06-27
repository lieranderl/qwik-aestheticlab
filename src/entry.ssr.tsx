import { isDev } from "@builder.io/qwik/build";
import {
	type RenderOptions,
	type RenderToStreamOptions,
	renderToStream,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";
import { config } from "./speak-config";

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
