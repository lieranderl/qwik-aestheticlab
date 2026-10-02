import type { RequestHandler } from "@qwik.dev/router";
import {
	getErrorHtml,
	ServerError,
} from "@qwik.dev/router/middleware/request-handler";

/**
 * Added by `qwik migrate-v2`. v1 answered errors thrown with `throw ev.error(status, data)` with a
 * minimal error page, v2 renders the error page of the app instead. Remove this plugin to use the v2
 * behavior.
 */
export const onRequest: RequestHandler = async (ev) => {
	try {
		await ev.next();
	} catch (e) {
		const accept = ev.request.headers.get("Accept");
		if (
			e instanceof ServerError &&
			!ev.headersSent &&
			!ev.internalRequest &&
			(!accept || accept.includes("text/html"))
		) {
			ev.html(
				e.status as Parameters<typeof ev.html>[0],
				getErrorHtml(e.status, e.data),
			);
			return;
		}
		throw e;
	}
};
