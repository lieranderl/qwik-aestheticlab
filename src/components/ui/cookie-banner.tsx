import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import {
	disableAnalytics,
	enableAnalytics,
	initializeGoogleAnalytics,
	readCookieConsent,
	saveCookieConsent,
} from "~/shared/cookie-consent";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const CookieBanner = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();

	const showBanner = useSignal(false);
	const hasChoice = useSignal(false);

	// biome-ignore lint/correctness/noQwikUseVisibleTask: Needs client-only storage/script initialization.
	useVisibleTask$(() => {
		initializeGoogleAnalytics();
		const stored = readCookieConsent();
		if (!stored) {
			showBanner.value = true;
			return;
		}

		hasChoice.value = true;
		if (stored.analytics) {
			enableAnalytics({ trackUpdate: false });
			return;
		}

		disableAnalytics({ trackUpdate: false });
	});

	const acceptAll = $(() => {
		saveCookieConsent(true);
		enableAnalytics();
		hasChoice.value = true;
		showBanner.value = false;
	});

	const rejectOptional = $(() => {
		saveCookieConsent(false);
		disableAnalytics();
		hasChoice.value = true;
		showBanner.value = false;
	});

	const openSettings = $(() => {
		showBanner.value = true;
	});

	const privacyHref = getLocaleNavLink(location.url.pathname, "privacy-policy");

	return (
		<>
			{showBanner.value && (
				<div class="fixed top-18 right-3 left-3 z-120 md:top-auto md:right-6 md:bottom-6 md:left-auto md:w-[min(28rem,calc(100vw-3rem))]">
					<div class="max-h-[38svh] overflow-y-auto rounded-2xl border border-base-content/15 bg-base-100/96 p-4 shadow-xl backdrop-blur md:max-h-none md:p-5">
						<div class="flex flex-col gap-4">
							<div class="space-y-2">
								<p class="font-montserrat text-sm font-semibold uppercase tracking-wider text-base-content">
									{t("app.cookies.title@@Cookie settings")}
								</p>
								<p class="text-sm text-base-content/80">
									{t(
										"app.cookies.description@@We use strictly necessary cookies to run this site. Google Analytics runs in Consent Mode: analytics storage is denied unless you accept, and Google may receive cookieless consent and measurement pings before your choice.",
									)}
								</p>
								<div class="text-xs text-base-content/70">
									{t(
										"app.cookies.necessary@@Strictly necessary cookies are always active.",
									)}{" "}
									<a class="link link-primary" href={privacyHref}>
										{t("app.cookies.privacy_link@@Read our Privacy Policy")}
									</a>
								</div>
							</div>

							<div class="flex gap-2 sm:items-center sm:justify-end">
								<button
									type="button"
									class="btn btn-outline btn-sm min-w-0 flex-1 rounded-full px-3 text-xs sm:flex-none"
									onClick$={rejectOptional}
								>
									{t("app.cookies.reject@@Reject analytics")}
								</button>
								<button
									type="button"
									class="btn btn-primary btn-sm min-w-0 flex-1 rounded-full px-3 text-xs sm:flex-none"
									onClick$={acceptAll}
								>
									{t("app.cookies.accept@@Accept analytics")}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{hasChoice.value && !showBanner.value && (
				<div class="fixed bottom-2 left-2 z-110 md:bottom-4 md:left-4">
					<button
						type="button"
						class="btn btn-xs btn-ghost min-h-7 rounded-full border border-base-content/20 bg-base-100/80 px-2 text-[0.68rem] opacity-75 backdrop-blur transition-opacity hover:opacity-100 focus-visible:opacity-100 md:min-h-8 md:px-3 md:text-xs md:opacity-100"
						onClick$={openSettings}
					>
						{t("app.cookies.settings@@Cookie settings")}
					</button>
				</div>
			)}
		</>
	);
});
