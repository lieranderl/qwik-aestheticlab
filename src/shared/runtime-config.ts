type RuntimeEnvironment = Record<string, string | undefined>;

function isLocalHttpUrl(url: URL) {
	return (
		url.protocol === "http:" &&
		["localhost", "127.0.0.1", "::1"].includes(url.hostname)
	);
}

function isLeastPrivilegeSupabaseKey(key: string) {
	if (key.startsWith("sb_publishable_")) return true;
	if (key.startsWith("sb_secret_")) return false;

	const parts = key.split(".");
	if (parts.length !== 3) return false;

	try {
		const payload = JSON.parse(
			Buffer.from(parts[1], "base64url").toString("utf8"),
		) as { role?: string };
		return payload.role === "anon";
	} catch {
		return false;
	}
}

export function isRuntimeConfigReady(environment: RuntimeEnvironment) {
	const rawUrl = environment.SUPABASE_URL?.trim();
	const key = environment.SUPABASE_KEY?.trim();

	if (!rawUrl || !key || !isLeastPrivilegeSupabaseKey(key)) return false;

	try {
		const url = new URL(rawUrl);
		return url.protocol === "https:" || isLocalHttpUrl(url);
	} catch {
		return false;
	}
}
