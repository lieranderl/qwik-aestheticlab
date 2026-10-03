import {
	$,
	component$,
	useOnWindow,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import {
	disableAnalytics,
	enableAnalytics,
	initializeGoogleAnalytics,
	OPEN_COOKIE_SETTINGS_EVENT,
	readCookieConsent,
	saveCookieConsent,
} from "~/shared/cookie-consent";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const CookieBanner = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	const titleId = "cookie-settings-title";
	const descriptionId = "cookie-settings-description";

	const showBanner = useSignal(false);

	// biome-ignore lint/correctness/noQwikUseVisibleTask: Needs client-only storage/script initialization.
	useVisibleTask$(
		() => {
			initializeGoogleAnalytics();
			const stored = readCookieConsent();
			if (!stored) {
				showBanner.value = true;
				return;
			}

			if (stored.analytics) {
				enableAnalytics({ trackUpdate: false });
				return;
			}

			disableAnalytics({ trackUpdate: false });
		},
		// The wrapper is empty until a banner shows, so it never becomes "visible".
		{ strategy: "document-ready" },
	);

	const acceptAll = $(() => {
		saveCookieConsent(true);
		enableAnalytics();
		showBanner.value = false;
	});

	const rejectOptional = $(() => {
		saveCookieConsent(false);
		disableAnalytics();
		showBanner.value = false;
	});

	const openSettings = $(() => {
		showBanner.value = true;
	});

	const privacyHref = getLocaleNavLink(location.url.pathname, "privacy-policy");

	useOnWindow(OPEN_COOKIE_SETTINGS_EVENT, openSettings);

	// Always render the wrapper: Qwik attaches the window listener to it.
	return (
		<div data-cookie-consent>
			{showBanner.value && (
				<section
					class="fixed top-[calc(env(safe-area-inset-top)+4.25rem)] right-3 left-3 z-50 motion-safe:animate-fade-in motion-reduce:animate-none md:top-auto md:right-auto md:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] md:left-6 md:w-[min(26rem,calc(100vw-3rem))]"
					aria-labelledby={titleId}
					aria-describedby={descriptionId}
				>
					<div class="flex max-h-[45svh] flex-col gap-2.5 overflow-y-auto overscroll-contain border border-base-300 bg-base-100 p-3.5 sm:gap-3 sm:p-5 text-base-content shadow-[0_12px_32px_rgb(26_36_26/0.25)]">
						{/* Phones: compact, so the hero headline and booking button stay in view. */}
						<div class="flex items-baseline justify-between gap-4 max-sm:sr-only">
							<h2
								id={titleId}
								class="font-cormorant text-[1.625rem] leading-none"
							>
								{t("app.cookies.heading@@Cookies")}
							</h2>
							<a
								class="link inline-flex min-h-11 items-center font-main text-xs underline-offset-3"
								href={privacyHref}
							>
								{t("app.cookies.privacy_link@@Read our Privacy Policy")}
							</a>
						</div>
						<p
							id={descriptionId}
							class="font-main text-sm leading-normal text-base-content"
						>
							{t(
								"app.cookies.summary@@Necessary cookies keep the site working. Analytics cookies are only set if you allow them.",
							)}{" "}
							<a class="link sm:hidden" href={privacyHref}>
								{t("app.cookies.privacy_link@@Read our Privacy Policy")}
							</a>
						</p>
						<div class="grid grid-cols-2 gap-2">
							<button
								type="button"
								class="btn btn-outline h-11 min-h-11 border-neutral px-2 font-main text-sm font-semibold sm:h-12 sm:min-h-12"
								onClick$={rejectOptional}
							>
								{t("app.cookies.reject@@Reject analytics")}
							</button>
							<button
								type="button"
								class="btn btn-outline h-11 min-h-11 border-neutral px-2 font-main text-sm font-semibold sm:h-12 sm:min-h-12"
								onClick$={acceptAll}
							>
								{t("app.cookies.accept@@Accept analytics")}
							</button>
						</div>
					</div>
				</section>
			)}
		</div>
	);
});
