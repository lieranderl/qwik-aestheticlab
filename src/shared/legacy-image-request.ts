/** Resolve cached pre-v4.0.1 image URLs without changing their content hash. */
export function getLegacyImageRequest(request: Request): Request | null {
	if (request.method !== "GET" && request.method !== "HEAD") return null;

	const url = new URL(request.url);
	const match = /^\/assets\/([A-Za-z0-9_-]{8})-lazer1\.webp$/.exec(
		url.pathname,
	);
	if (!match) return null;

	url.pathname = `/assets/${match[1]}-universal.webp`;
	return new Request(url, request);
}
