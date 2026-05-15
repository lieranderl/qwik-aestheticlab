import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import {
	initializeGoogleAnalytics,
	trackGoogleAnalyticsPageView,
} from "~/shared/cookie-consent";

export const GoogleAnalytics = component$(() => {
	const location = useLocation();
	const trackedRoute = useSignal("");

	// biome-ignore lint/correctness/noQwikUseVisibleTask: GA route tracking is browser-only and depends on window/document.
	useVisibleTask$(({ track }) => {
		initializeGoogleAnalytics();
		const route = track(
			() =>
				`${location.url.pathname}${location.url.search}${location.url.hash}`,
		);

		if (!trackedRoute.value) {
			trackedRoute.value = route;
			return;
		}

		if (trackedRoute.value === route) return;

		trackedRoute.value = route;
		trackGoogleAnalyticsPageView();
	});

	return null;
});
