import { gaMeasurementId } from "~/consts";

export const CONSENT_STORAGE_KEY = "aestheticlab_cookie_consent_v2";
const GA_SCRIPT_ID = "aestheticlab-ga-script";

export type StoredConsent = {
	version: 1;
	analytics: boolean;
	updatedAt: string;
};

type AnalyticsWindow = Window & {
	[key: `ga-disable-${string}`]: boolean | undefined;
	dataLayer?: unknown[];
	gtag?: (...args: unknown[]) => void;
	__gaConfigured?: boolean;
};

export const readCookieConsent = (): StoredConsent | null => {
	try {
		const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as StoredConsent;
		if (parsed?.version !== 1 || typeof parsed.analytics !== "boolean") {
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
	localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
};

export const disableAnalytics = () => {
	const analyticsWindow = window as unknown as AnalyticsWindow;
	analyticsWindow[`ga-disable-${gaMeasurementId}`] = true;
};

export const enableAnalytics = () => {
	const analyticsWindow = window as unknown as AnalyticsWindow;
	analyticsWindow[`ga-disable-${gaMeasurementId}`] = false;

	if (!document.getElementById(GA_SCRIPT_ID)) {
		const scriptEl = document.createElement("script");
		scriptEl.id = GA_SCRIPT_ID;
		scriptEl.async = true;
		scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
		document.head.appendChild(scriptEl);
	}

	analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
	analyticsWindow.gtag =
		analyticsWindow.gtag ||
		((...args: unknown[]) => {
			analyticsWindow.dataLayer?.push(args);
		});

	if (!analyticsWindow.__gaConfigured) {
		analyticsWindow.gtag("js", new Date());
		analyticsWindow.gtag("config", gaMeasurementId, {
			anonymize_ip: true,
		});
		analyticsWindow.__gaConfigured = true;
	}
};
