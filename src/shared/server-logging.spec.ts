import { describe, expect, it, vi } from "vitest";
import { logServerEvent } from "./server-logging";

describe("logServerEvent", () => {
	it("logs ERROR severity to console.error", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(vi.fn());

		logServerEvent("ERROR", "test error", { detail: "boom" });

		expect(spy).toHaveBeenCalledOnce();
		const entry = JSON.parse(spy.mock.calls[0]?.[0] as string);
		expect(entry).toMatchObject({
			severity: "ERROR",
			message: "test error",
			detail: "boom",
		});
		spy.mockRestore();
	});

	it("logs WARNING severity to console.warn", () => {
		const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

		logServerEvent("WARNING", "test warning");

		expect(spy).toHaveBeenCalledOnce();
		const entry = JSON.parse(spy.mock.calls[0]?.[0] as string);
		expect(entry).toMatchObject({
			severity: "WARNING",
			message: "test warning",
		});
		spy.mockRestore();
	});

	it("logs INFO severity to console.log", () => {
		const spy = vi.spyOn(console, "log").mockImplementation(vi.fn());

		logServerEvent("INFO", "server_started", { port: 3000 });

		expect(spy).toHaveBeenCalledOnce();
		const entry = JSON.parse(spy.mock.calls[0]?.[0] as string);
		expect(entry).toMatchObject({
			severity: "INFO",
			message: "server_started",
			port: 3000,
		});
		spy.mockRestore();
	});

	it("logs DEBUG severity to console.log", () => {
		const spy = vi.spyOn(console, "log").mockImplementation(vi.fn());

		logServerEvent("DEBUG", "debug message");

		expect(spy).toHaveBeenCalledOnce();
		const entry = JSON.parse(spy.mock.calls[0]?.[0] as string);
		expect(entry).toMatchObject({
			severity: "DEBUG",
			message: "debug message",
		});
		spy.mockRestore();
	});

	it("defaults context to empty object when not provided", () => {
		const spy = vi.spyOn(console, "log").mockImplementation(vi.fn());

		logServerEvent("INFO", "no context");

		const entry = JSON.parse(spy.mock.calls[0]?.[0] as string);
		expect(entry).toEqual({
			severity: "INFO",
			message: "no context",
		});
		spy.mockRestore();
	});
});
