import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import {
	disableAnalytics,
	enableAnalytics,
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
		const stored = readCookieConsent();
		if (!stored) {
			showBanner.value = true;
			return;
		}

		hasChoice.value = true;
		if (stored.analytics) {
			enableAnalytics();
			return;
		}

		disableAnalytics();
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
				<div class="fixed inset-x-0 bottom-0 z-120 p-3 md:p-6">
					<div class="mx-auto max-w-4xl rounded-2xl border border-base-content/15 bg-base-100/96 p-4 shadow-xl backdrop-blur md:p-6">
						<div class="flex flex-col gap-4">
							<div class="space-y-2">
								<p class="font-montserrat text-sm font-semibold uppercase tracking-wider text-base-content">
									{t("app.cookies.title@@Cookie settings")}
								</p>
								<p class="text-sm text-base-content/80">
									{t(
										"app.cookies.description@@We use strictly necessary cookies to run this site. With your permission, we also use analytics cookies (Google Analytics) to understand traffic and improve our services.",
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

							<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
								<button
									type="button"
									class="btn btn-outline btn-sm rounded-full"
									onClick$={rejectOptional}
								>
									{t("app.cookies.reject@@Reject analytics")}
								</button>
								<button
									type="button"
									class="btn btn-primary btn-sm rounded-full"
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
				<div class="fixed bottom-4 left-4 z-110">
					<button
						type="button"
						class="btn btn-xs btn-ghost rounded-full border border-base-content/20 bg-base-100/85 backdrop-blur"
						onClick$={openSettings}
					>
						{t("app.cookies.settings@@Cookie settings")}
					</button>
				</div>
			)}
		</>
	);
});
