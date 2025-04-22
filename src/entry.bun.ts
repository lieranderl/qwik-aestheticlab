/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Bun HTTP server when building for production.
 *
 * Learn more about the Bun integration here:
 * - https://qwik.dev/docs/deployments/bun/
 * - https://bun.sh/docs/api/http
 *
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/bun";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";

// Create the Qwik City Bun middleware
const { router, notFound, staticFile } = createQwikCity({
	render,
	qwikCityPlan,
	manifest,
});

// Dynamic port support
const port = Number(Bun.env.PORT) || 3000;

// Trust proxy headers (Important for CSRF fix)
const trustProxy = (headers: Headers) =>
	headers.get("x-forwarded-proto") === "https";

// eslint-disable-next-line no-console
console.log(`🚀 Server started: http://localhost:${port}/`);

Bun.serve({
	port,
	routes: {
		// Health check endpoint
		"/healthz": new Response("OK"),
		// Wildcard route: everything else goes through Qwik City
		"/*": async (req: Request) => {
			let adjustedRequest = req;

			if (trustProxy(req.headers)) {
				const httpsUrl = new URL(req.url);
				httpsUrl.protocol = "https:";
				adjustedRequest = new Request(httpsUrl.toString(), req);
			}

			return (
				(await staticFile(adjustedRequest)) ||
				(await router(adjustedRequest)) ||
				notFound(adjustedRequest)
			);
		},
	},
});
