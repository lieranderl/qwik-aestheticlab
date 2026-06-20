type LogSeverity = "DEBUG" | "INFO" | "WARNING" | "ERROR";

export function logServerEvent(
	severity: LogSeverity,
	message: string,
	context: Record<string, unknown> = {},
) {
	const entry = JSON.stringify({
		severity,
		message,
		...context,
	});

	if (severity === "ERROR") {
		console.error(entry);
		return;
	}

	if (severity === "WARNING") {
		console.warn(entry);
		return;
	}

	console.log(entry);
}
