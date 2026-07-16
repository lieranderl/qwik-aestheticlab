import { gaMeasurementId } from "~/consts";

export const CONSENT_STORAGE_KEY = "aestheticlab_cookie_consent_v2";

type ConsentStatus = "granted" | "denied";

type GoogleConsentState = {
	ad_storage: ConsentStatus;
	ad_user_data: ConsentStatus;
	ad_personalization: ConsentStatus;
	analytics_storage: ConsentStatus;
	wait_for_update?: number;
};

type GoogleAnalyticsConfig = {
	anonymize_ip: boolean;
	allow_google_signals: boolean;
	allow_ad_personalization_signals: boolean;
	page_location?: string;
	page_path?: string;
	page_title?: string;
};

export type GoogleAnalyticsEventParams = Record<
	string,
	string | number | boolean | null | undefined
>;

export type StoredConsent = {
	version: 1;
	analytics: boolean;
	updatedAt: string;
};

type AnalyticsWindow = Window & {
	dataLayer?: unknown[];
	gtag?: (...args: unknown[]) => void;
	__aestheticAnalyticsInitialized?: boolean;
};

const deniedConsentState: GoogleConsentState = {
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "denied",
};

const analyticsConfig: GoogleAnalyticsConfig = {
	anonymize_ip: true,
	allow_google_signals: false,
	allow_ad_personalization_signals: false,
};

function serializeForInlineScript(value: unknown) {
	return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function getConsentState(analytics: boolean): GoogleConsentState {
	return {
		...deniedConsentState,
		analytics_storage: analytics ? "granted" : "denied",
	};
}

function getAnalyticsWindow() {
	return window as AnalyticsWindow;
}

function hasAnalyticsConsent() {
	return readCookieConsent()?.analytics === true;
}

function getPageContext() {
	return {
		page_location: window.location.href,
		page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
		page_title: document.title,
	};
}

function sanitizeEventParams(params: GoogleAnalyticsEventParams) {
	const sanitizedParams: GoogleAnalyticsEventParams = {};

	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined) {
			sanitizedParams[key] = value;
		}
	}

	return sanitizedParams;
}

function ensureGtag() {
	const analyticsWindow = getAnalyticsWindow();

	analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];

	const gtag =
		analyticsWindow.gtag ||
		function gtag() {
			// biome-ignore lint/complexity/noArguments: Matches Google's gtag.js bootstrap contract.
			analyticsWindow.dataLayer?.push(arguments);
		};
	analyticsWindow.gtag = gtag;

	// Consent Mode advanced relies on consent-aware pings when storage is denied.
	Object.assign(analyticsWindow, { [`ga-disable-${gaMeasurementId}`]: false });

	return gtag;
}

function loadGoogleAnalyticsScript() {
	const globalDocument = globalThis.document;
	if (
		!globalDocument ||
		typeof globalDocument.getElementById !== "function" ||
		typeof globalDocument.createElement !== "function" ||
		!globalDocument.head ||
		typeof globalDocument.head.appendChild !== "function"
	) {
		return;
	}

	const scriptId = "google-analytics-script";
	const existing = globalDocument.getElementById(
		scriptId,
	) as HTMLScriptElement | null;
	if (existing) return;

	const script = globalDocument.createElement("script");
	script.id = scriptId;
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
	globalDocument.head.appendChild(script);
}

export function initializeGoogleAnalytics() {
	const analyticsWindow = getAnalyticsWindow();
	if (analyticsWindow.__aestheticAnalyticsInitialized) {
		loadGoogleAnalyticsScript();
		return;
	}

	const gtag = ensureGtag();
	gtag("consent", "default", {
		...deniedConsentState,
		wait_for_update: 500,
	});
	gtag("set", "ads_data_redaction", true);
	gtag("set", "allow_ad_personalization_signals", false);

	const storedConsent = readCookieConsent();
	if (storedConsent) {
		gtag(
			"consent",
			"update",
			storedConsent.analytics ? getConsentState(true) : deniedConsentState,
		);
	}

	gtag("js", new Date());
	gtag("config", gaMeasurementId, analyticsConfig);
	loadGoogleAnalyticsScript();
	analyticsWindow.__aestheticAnalyticsInitialized = true;
}

export const getGoogleAnalyticsBootstrapScript = () => {
	const defaultConsent = {
		...deniedConsentState,
		wait_for_update: 500,
	};

	return `
(function () {
	var measurementId = ${serializeForInlineScript(gaMeasurementId)};
	var storageKey = ${serializeForInlineScript(CONSENT_STORAGE_KEY)};
	var deniedConsent = ${serializeForInlineScript(deniedConsentState)};
	var grantedAnalyticsConsent = ${serializeForInlineScript(getConsentState(true))};
	var config = ${serializeForInlineScript(analyticsConfig)};
	var storedConsent = null;

	window.dataLayer = window.dataLayer || [];
	window.gtag = window.gtag || function () {
		window.dataLayer.push(arguments);
	};
	window["ga-disable-" + measurementId] = false;

	window.gtag("consent", "default", ${serializeForInlineScript(defaultConsent)});
	window.gtag("set", "ads_data_redaction", true);
	window.gtag("set", "allow_ad_personalization_signals", false);

	try {
		var storedRaw = window.localStorage && window.localStorage.getItem(storageKey);
		if (storedRaw) {
			var parsed = JSON.parse(storedRaw);
			if (parsed && parsed.version === 1 && typeof parsed.analytics === "boolean") {
				storedConsent = parsed;
			}
		}
	} catch (error) {
		storedConsent = null;
	}

	if (storedConsent) {
		window.gtag(
			"consent",
			"update",
			storedConsent.analytics ? grantedAnalyticsConsent : deniedConsent,
		);
	}

	window.gtag("js", new Date());
	window.gtag("config", measurementId, config);
	window.__aestheticAnalyticsInitialized = true;
})();
`;
};

export const readCookieConsent = (): StoredConsent | null => {
	try {
		const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as StoredConsent;
		if (
			parsed?.version !== 1 ||
			typeof parsed.analytics !== "boolean" ||
			typeof parsed.updatedAt !== "string"
		) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
};

export const saveCookieConsent = (analytics: boolean) => {
	const payload: StoredConsent = {
		version: 1,
		analytics,
		updatedAt: new Date().toISOString(),
	};
	try {
		localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
};

export const disableAnalytics = (options: { trackUpdate?: boolean } = {}) => {
	ensureGtag()("consent", "update", getConsentState(false));
	if (options.trackUpdate === false) return;

	trackGoogleAnalyticsEvent(
		"cookie_consent_updated",
		{ analytics_consent: "denied" },
		{ consentRequired: false },
	);
};

export const enableAnalytics = (options: { trackUpdate?: boolean } = {}) => {
	loadGoogleAnalyticsScript();
	ensureGtag()("consent", "update", getConsentState(true));
	if (options.trackUpdate === false) return;

	trackGoogleAnalyticsEvent(
		"cookie_consent_updated",
		{ analytics_consent: "granted" },
		{ consentRequired: false },
	);
};

export const trackGoogleAnalyticsPageView = () => {
	let gtag = getAnalyticsWindow().gtag;
	if (!gtag) {
		initializeGoogleAnalytics();
		gtag = getAnalyticsWindow().gtag;
	}
	if (!gtag) return;

	gtag("config", gaMeasurementId, {
		...analyticsConfig,
		...getPageContext(),
	});
};

export const trackGoogleAnalyticsEvent = (
	eventName: string,
	params: GoogleAnalyticsEventParams = {},
	options: { consentRequired?: boolean } = {},
) => {
	if (options.consentRequired !== false && !hasAnalyticsConsent()) return;

	let gtag = getAnalyticsWindow().gtag;
	if (!gtag) {
		initializeGoogleAnalytics();
		gtag = getAnalyticsWindow().gtag;
	}
	if (!gtag) return;

	gtag("event", eventName, {
		...getPageContext(),
		...sanitizeEventParams(params),
	});
};
