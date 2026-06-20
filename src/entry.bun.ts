import { createQwikCity } from "@builder.io/qwik-city/middleware/bun";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import { isRuntimeConfigReady } from "~/shared/runtime-config";
import { applySecurityHeaders } from "~/shared/security-headers";
import { logServerEvent } from "~/shared/server-logging";
import { isSupabaseDependencyReady } from "~/shared/supabase-readiness";
import render from "./entry.ssr";

// Create the Qwik City Bun middleware
const { router, notFound, staticFile } = createQwikCity({
	render,
	qwikCityPlan,
	manifest,
});

// Allow for dynamic port
const port = Number(Bun.env.PORT) || 3000;

logServerEvent("INFO", "server_started", { port });

function statusResponse(ready = true) {
	return applySecurityHeaders(
		new Response(ready ? "OK" : "NOT READY", {
			status: ready ? 200 : 503,
			headers: { "Cache-Control": "no-store" },
		}),
	);
}

function supportsCompression(response: Response) {
	if (!response.body) return false;
	if (response.headers.has("Content-Encoding")) return false;
	if ([101, 204, 205, 304].includes(response.status)) return false;

	const contentType = response.headers.get("Content-Type") || "";

	return [
		"text/html",
		"text/css",
		"text/plain",
		"text/javascript",
		"application/javascript",
		"application/json",
		"application/xml",
		"text/xml",
		"image/svg+xml",
	].some((type) => contentType.includes(type));
}

function maybeCompressResponse(request: Request, response: Response) {
	if (
		typeof CompressionStream === "undefined" ||
		request.method === "HEAD" ||
		!supportsCompression(response)
	) {
		return response;
	}

	const acceptEncoding = request.headers.get("Accept-Encoding") || "";

	if (!acceptEncoding.includes("gzip")) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set("Content-Encoding", "gzip");
	headers.delete("Content-Length");

	const vary = headers.get("Vary");
	headers.set("Vary", vary ? `${vary}, Accept-Encoding` : "Accept-Encoding");

	return new Response(
		response.body?.pipeThrough(new CompressionStream("gzip")),
		{
			status: response.status,
			statusText: response.statusText,
			headers,
		},
	);
}

Bun.serve({
	port,
	routes: {
		"/healthz": {
			GET: () => statusResponse(),
		},
		"/readyz": {
			GET: () => statusResponse(isRuntimeConfigReady(Bun.env)),
		},
		"/dependencyz": {
			GET: async () => statusResponse(await isSupabaseDependencyReady(Bun.env)),
		},
	},
	async fetch(request: Request) {
		const { headers, url } = request;
		let adjustedRequest = request;

		if (headers.get("x-forwarded-proto") === "https") {
			const httpsUrl = new URL(url);
			httpsUrl.protocol = "https:";
			adjustedRequest = new Request(httpsUrl.toString(), request);
		}

		// Try handling with Qwik City router
		const response =
			(await staticFile(adjustedRequest)) ??
			(await router(adjustedRequest)) ??
			(await notFound(adjustedRequest));

		if (response) {
			const url = new URL(adjustedRequest.url);
			const pathname = url.pathname;
			const isSuccessfulResponse =
				response.status >= 200 && response.status < 400;

			// Add cache control headers
			if (pathname.startsWith("/build/") && isSuccessfulResponse) {
				// Qwik build assets are hashed, safe to cache for a long time
				response.headers.set(
					"Cache-Control",
					"public, max-age=31536000, immutable",
				);
			} else if (pathname.startsWith("/assets/") && isSuccessfulResponse) {
				response.headers.set(
					"Cache-Control",
					"public, max-age=31536000, immutable",
				);
			} else if (
				!isSuccessfulResponse &&
				(pathname.startsWith("/build/") || pathname.startsWith("/assets/"))
			) {
				response.headers.set("Cache-Control", "no-store");
			} else if (pathname.startsWith("/fonts/")) {
				response.headers.set(
					"Cache-Control",
					"public, max-age=2592000, stale-while-revalidate=604800",
				);
			} else if (
				pathname.startsWith("/media/") ||
				pathname.endsWith(".png") ||
				pathname.endsWith(".jpg") ||
				pathname.endsWith(".jpeg") ||
				pathname.endsWith(".webp") ||
				pathname.endsWith(".svg") ||
				pathname.endsWith(".ico") ||
				pathname.endsWith(".json") ||
				pathname.endsWith(".xml") ||
				pathname.endsWith(".txt")
			) {
				// Other static assets
				response.headers.set(
					"Cache-Control",
					"public, max-age=604800, stale-while-revalidate=2592000",
				);
			}
			const securedResponse = applySecurityHeaders(response);
			return maybeCompressResponse(adjustedRequest, securedResponse);
		}

		return response;
	},
});
