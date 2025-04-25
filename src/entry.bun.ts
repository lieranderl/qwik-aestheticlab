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

// Allow for dynamic port
const port = Number(Bun.env.PORT) || 3000;

// Trust proxy headers (Important for CSRF fix)
const trustProxy = (headers: Headers) =>
	headers.get("x-forwarded-proto") === "https";

// eslint-disable-next-line no-console
console.log(`🚀 Server started: http://localhost:${port}/`);

Bun.serve({
	port,
	routes: {
		"/healthz": {
			GET: () => new Response("OK", { status: 200 }),
		},
	},
	async fetch(request: Request) {
		const { headers, url } = request;
		let adjustedRequest = request;

		if (trustProxy(headers)) {
			const httpsUrl = new URL(url);
			httpsUrl.protocol = "https:";
			adjustedRequest = new Request(httpsUrl.toString(), request);
		}

		// Try handling with Qwik City router
		const response =
			(await staticFile(adjustedRequest)) ??
			(await router(adjustedRequest)) ??
			notFound(adjustedRequest);

		return response;
	},
});
