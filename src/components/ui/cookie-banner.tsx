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
	const titleId = "cookie-settings-title";
	const descriptionId = "cookie-settings-description";

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
				<section
					class="fixed bottom-3 right-3 left-3 z-50 motion-safe:animate-fade-in md:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] md:left-4 md:right-auto md:w-[min(28rem,calc(100vw-3rem))] motion-reduce:animate-none"
					aria-labelledby={titleId}
					aria-describedby={descriptionId}
				>
					<div class="max-h-[50svh] overflow-y-auto overscroll-contain rounded-2xl border border-base-content/10 bg-base-100/98 p-4 shadow-xl md:p-5">
						<div class="flex flex-col gap-4">
							<div class="space-y-2">
								<p
									id={titleId}
									class="font-main text-sm font-semibold uppercase tracking-wider text-base-content"
								>
									{t("app.cookies.title@@Cookie settings")}
								</p>
								<p id={descriptionId} class="text-sm text-base-content/80">
									{t(
										"app.cookies.description@@We use strictly necessary cookies to run this site. Google Analytics runs in Consent Mode: analytics storage is denied unless you accept, and Google may receive cookieless consent and measurement pings before your choice.",
									)}
								</p>
								<div class="text-xs text-base-content">
									{t(
										"app.cookies.necessary@@Strictly necessary cookies are always active.",
									)}{" "}
									<a
										class="link inline-flex min-h-11 items-center"
										href={privacyHref}
									>
										{t("app.cookies.privacy_link@@Read our Privacy Policy")}
									</a>
								</div>
							</div>

							<div class="flex gap-2 sm:items-center sm:justify-end">
								<button
									type="button"
									class="btn btn-outline btn-sm min-h-11 min-w-0 flex-1 rounded-full px-3 text-xs sm:flex-none"
									onClick$={rejectOptional}
								>
									{t("app.cookies.reject@@Reject analytics")}
								</button>
								<button
									type="button"
									class="btn btn-primary btn-sm min-h-11 min-w-0 flex-1 rounded-full px-3 text-xs sm:flex-none"
									onClick$={acceptAll}
								>
									{t("app.cookies.accept@@Accept analytics")}
								</button>
							</div>
						</div>
					</div>
				</section>
			)}

			{hasChoice.value && !showBanner.value && (
				<div class="fixed bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] left-2 z-30 md:bottom-[calc(env(safe-area-inset-bottom)+1rem)] md:left-4">
					<button
						type="button"
						class="btn btn-square btn-sm rounded-full border border-base-content/20 bg-base-100/95 text-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 md:w-auto md:px-4 md:opacity-90"
						onClick$={openSettings}
						aria-label={t("app.cookies.settings@@Cookie settings")}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4"
							/>
						</svg>
						<span class="hidden md:inline">
							{t("app.cookies.settings@@Cookie settings")}
						</span>
					</button>
				</div>
			)}
		</>
	);
});
