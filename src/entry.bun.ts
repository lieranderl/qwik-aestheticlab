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

// Liveness probe endpoint
const livenessHandler = () => {
	return new Response("OK", { status: 200 });
};

// Allow for dynamic port
const port = Number(Bun.env.PORT ?? 3000);

// Trust proxy headers (Important for CSRF fix)
const trustProxy = (req: Request) => {
	const forwardedProto = req.headers.get("x-forwarded-proto");
	return forwardedProto === "https";
};

// eslint-disable-next-line no-console
console.log(`Server started: http://localhost:${port}/`);

Bun.serve({
	async fetch(request: Request) {
		let adjustedRequest = request;
		const url = new URL(request.url);
		if (url.pathname === "/healthz") {
			return livenessHandler();
		}

		if (trustProxy(request)) {
			const url = new URL(request.url);
			url.protocol = "https:";
			adjustedRequest = new Request(url.toString(), request);
		}

		// Server-side render this request with Qwik City
		const qwikCityResponse = await router(adjustedRequest);
		if (qwikCityResponse) {
			return qwikCityResponse;
		}

		const staticResponse = await staticFile(adjustedRequest);
		if (staticResponse) {
			return staticResponse;
		}

		// Path not found
		return notFound(adjustedRequest);
	},
	port,
});
