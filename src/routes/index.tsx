import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

export const onGet: RequestHandler = async ({ redirect }) => {
	throw redirect(302, `/${config.defaultLocale.lang}/`);
};

export default component$(() => {
	return <div>Redirecting...</div>;
});
