import { component$ } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";
import { routeLoader$ } from "@qwik.dev/router";
import { config } from "~/i18n-config";

export const onGet: RequestHandler = async ({ redirect }) => {
	throw redirect(302, `/${config.defaultLocale.lang}/`);
};

export default component$(() => {
	return null;
});
export const useV1NavigationProbe = routeLoader$(() => null);
