import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { gaMeasurementId } from "~/consts";

import {
	CONSENT_STORAGE_KEY,
	disableAnalytics,
	enableAnalytics,
	readCookieConsent,
	saveCookieConsent,
	trackGoogleAnalyticsEvent,
	trackGoogleAnalyticsPageView,
} from "./cookie-consent";

type MockStorage = {
	getItem: ReturnType<typeof vi.fn>;
	setItem: ReturnType<typeof vi.fn>;
	removeItem: ReturnType<typeof vi.fn>;
	clear: ReturnType<typeof vi.fn>;
};

type MockAnalyticsWindow = Window & {
	dataLayer?: IArguments[];
	gtag?: (...args: unknown[]) => void;
	[key: `ga-disable-${string}`]: boolean | undefined;
};

// biome-ignore lint/correctness/useQwikValidLexicalScope: Test helper runs only in Vitest's Node environment.
const createLocalStorageMock = () => {
	const storage = new Map<string, string>();

	const localStorageMock: MockStorage = {
		getItem: vi.fn((key: string) => storage.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			storage.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			storage.delete(key);
		}),
		clear: vi.fn(() => {
			storage.clear();
		}),
	};

	return { storage, localStorageMock };
};

// biome-ignore lint/correctness/useQwikValidLexicalScope: Test helper installs mocked browser globals for unit tests.
const installBrowserGlobals = () => {
	const { storage, localStorageMock } = createLocalStorageMock();

	Object.assign(globalThis, {
		localStorage: localStorageMock,
		document: {
			title: "Aesthetic Lab",
		},
		window: {
			location: {
				href: "https://aestheticlab.test/en-BE/pricelist?view=full#prices",
				pathname: "/en-BE/pricelist",
				search: "?view=full",
				hash: "#prices",
			},
		},
	});

	return { storage, localStorageMock };
};

function getMockWindow() {
	return globalThis.window as unknown as MockAnalyticsWindow;
}

describe("cookie-consent helpers", () => {
	beforeEach(() => {
		installBrowserGlobals();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		delete (globalThis as unknown as Record<string, unknown>).window;
		delete (globalThis as unknown as Record<string, unknown>).document;
		delete (globalThis as unknown as Record<string, unknown>).localStorage;
	});

	describe("readCookieConsent", () => {
		it("parses a valid stored consent payload", () => {
			localStorage.setItem(
				CONSENT_STORAGE_KEY,
				JSON.stringify({
					version: 1,
					analytics: true,
					updatedAt: "2026-04-17T10:00:00.000Z",
				}),
			);

			expect(readCookieConsent()).toEqual({
				version: 1,
				analytics: true,
				updatedAt: "2026-04-17T10:00:00.000Z",
			});
		});

		it("returns null for malformed or unsupported stored payloads", () => {
			expect(readCookieConsent()).toBeNull();

			localStorage.setItem(CONSENT_STORAGE_KEY, "{invalid json");
			expect(readCookieConsent()).toBeNull();

			localStorage.setItem(
				CONSENT_STORAGE_KEY,
				JSON.stringify({
					version: 2,
					analytics: true,
					updatedAt: "2026-04-17T10:00:00.000Z",
				}),
			);
			expect(readCookieConsent()).toBeNull();

			localStorage.setItem(
				CONSENT_STORAGE_KEY,
				JSON.stringify({
					version: 1,
					analytics: "yes",
					updatedAt: "2026-04-17T10:00:00.000Z",
				}),
			);
			expect(readCookieConsent()).toBeNull();
		});
	});

	describe("saveCookieConsent", () => {
		it("serializes consent with version, analytics flag, and timestamp", () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2026-04-17T12:34:56.000Z"));

			saveCookieConsent(true);

			expect(localStorage.setItem).toHaveBeenCalledTimes(1);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				CONSENT_STORAGE_KEY,
				JSON.stringify({
					version: 1,
					analytics: true,
					updatedAt: "2026-04-17T12:34:56.000Z",
				}),
			);
		});
	});

	describe("trackGoogleAnalyticsEvent", () => {
		it("suppresses events when consent is missing", () => {
			const gtag = vi.fn();
			getMockWindow().gtag = gtag;

			trackGoogleAnalyticsEvent("cta_clicked", {
				location: "hero",
			});

			expect(gtag).not.toHaveBeenCalled();
		});

		it("emits sanitized event params when consent is granted", () => {
			const gtag = vi.fn();
			getMockWindow().gtag = gtag;

			saveCookieConsent(true);

			trackGoogleAnalyticsEvent("cta_clicked", {
				label: "Book now",
				position: 1,
				is_primary: true,
				empty_value: null,
				missing_value: undefined,
			});

			expect(gtag).toHaveBeenCalledTimes(1);
			expect(gtag).toHaveBeenCalledWith("event", "cta_clicked", {
				page_location:
					"https://aestheticlab.test/en-BE/pricelist?view=full#prices",
				page_path: "/en-BE/pricelist?view=full#prices",
				page_title: "Aesthetic Lab",
				label: "Book now",
				position: 1,
				is_primary: true,
			});
		});

		it("can emit events without stored consent when consent checks are disabled", () => {
			const gtag = vi.fn();
			getMockWindow().gtag = gtag;

			trackGoogleAnalyticsEvent(
				"cookie_banner_shown",
				{
					variant: "default",
				},
				{ consentRequired: false },
			);

			expect(gtag).toHaveBeenCalledWith("event", "cookie_banner_shown", {
				page_location:
					"https://aestheticlab.test/en-BE/pricelist?view=full#prices",
				page_path: "/en-BE/pricelist?view=full#prices",
				page_title: "Aesthetic Lab",
				variant: "default",
			});
		});
	});

	describe("analytics updates", () => {
		it("updates analytics consent and tracks a granted event by default", () => {
			enableAnalytics();

			expect(getMockWindow()[`ga-disable-${gaMeasurementId}`]).toBe(false);
			expect(getMockWindow().dataLayer).toHaveLength(2);
			expect(getMockWindow().dataLayer?.[0]).toMatchObject({
				0: "consent",
				1: "update",
				2: {
					ad_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied",
					analytics_storage: "granted",
				},
			});
			expect(getMockWindow().dataLayer?.[1]).toMatchObject({
				0: "event",
				1: "cookie_consent_updated",
				2: expect.objectContaining({
					analytics_consent: "granted",
					page_title: "Aesthetic Lab",
				}),
			});
		});

		it("updates analytics consent and can skip tracking the update event", () => {
			disableAnalytics({ trackUpdate: false });

			expect(getMockWindow()[`ga-disable-${gaMeasurementId}`]).toBe(false);
			expect(getMockWindow().dataLayer).toHaveLength(1);
			expect(getMockWindow().dataLayer?.[0]).toMatchObject({
				0: "consent",
				1: "update",
				2: {
					ad_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied",
					analytics_storage: "denied",
				},
			});
		});
	});

	describe("trackGoogleAnalyticsPageView", () => {
		it("uses the existing gtag function to emit a page-view config update", () => {
			const gtag = vi.fn();
			getMockWindow().gtag = gtag;

			trackGoogleAnalyticsPageView();

			expect(gtag).toHaveBeenCalledWith("config", gaMeasurementId, {
				anonymize_ip: true,
				allow_google_signals: false,
				allow_ad_personalization_signals: false,
				page_location:
					"https://aestheticlab.test/en-BE/pricelist?view=full#prices",
				page_path: "/en-BE/pricelist?view=full#prices",
				page_title: "Aesthetic Lab",
			});
		});
	});
});
