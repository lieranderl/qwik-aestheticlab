import {
	$,
	component$,
	useOnWindow,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HiMapPinOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { LanguageSwitcher } from "~/components/ui/language-switcher";
import { SITE_METADATA } from "~/constants/metadata";
import { googlePlaceUrl } from "~/consts";
import BirdLogo from "~/media/Bird.svg?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import {
	getLocaleNavLink,
	getLocaleSwitchLinks,
} from "~/shared/locale-navigation";
import { getNavLinkKeys } from "~/shared/nav-links";

const HEADER_PHONE_HEIGHT = 64;

interface NavigationProps {
	/** Phone booking bar; off where the page already shows its own Book button. */
	bookingBar?: boolean;
}

export const Navigation = component$<NavigationProps>(
	({ bookingBar = true }) => {
		const t = inlineTranslate();
		const location = useLocation();
		const isLandingPage = /^\/(?:[a-z]{2}-[A-Z]{2}\/?)?$/.test(
			location.url.pathname,
		);
		const isScrolled = useSignal(false);
		const isOverHero = useSignal(isLandingPage);
		const showBookingBar = useSignal(!isLandingPage);
		const activeSection = useSignal("");
		const isMobileMenuOpen = useSignal(false);
		const progressRef = useSignal<HTMLElement>();
		const mobileMenuToggleRef = useSignal<HTMLButtonElement>();
		const mobileMenuCloseRef = useSignal<HTMLButtonElement>();
		const mobileMenuId = "mobile-navigation-menu";
		const mobileMenuTitleId = `${mobileMenuId}-title`;

		const navLabels: Record<string, string> = {
			"app.nav.services@@Services": t("app.nav.services@@Services"),
			"app.nav.prices@@Prices": t("app.nav.prices@@Prices"),
			"app.nav.work@@Our Work": t("app.nav.work@@Our Work"),
			"app.nav.team@@Team": t("app.nav.team@@Team"),
			"app.nav.faq@@Good to know": t("app.nav.faq@@Good to know"),
			"app.nav.visit@@Visit": t("app.nav.visit@@Visit"),
		};
		const navLinks = getNavLinkKeys().map((link) => ({
			...link,
			label: navLabels[link.key],
			url: getLocaleNavLink(location.url.pathname, link.href),
		}));

		const localeLinks = getLocaleSwitchLinks(location.url.pathname);
		const currentLang =
			localeLinks.find((locale) => locale.isCurrent)?.lang ?? "en-BE";

		const updateScrollState = $(() => {
			const scrollY = window.scrollY;
			isScrolled.value = scrollY > 24;

			const hero = document.getElementById("hero");
			const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
			isOverHero.value = heroBottom > HEADER_PHONE_HEIGHT;
			showBookingBar.value = heroBottom < window.innerHeight * 0.35;

			const scrollable =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0;
			if (progressRef.value) {
				progressRef.value.style.transform = `scaleX(${progress})`;
			}
		});

		const closeMobileMenu = $(() => {
			isMobileMenuOpen.value = false;
			requestAnimationFrame(() => mobileMenuToggleRef.value?.focus());
		});
		const openMobileMenu = $(() => {
			isMobileMenuOpen.value = true;
		});

		useOnWindow("scroll", updateScrollState);
		useOnWindow("resize", updateScrollState);

		useOnWindow(
			"keydown",
			$((event) => {
				const keyboardEvent = event as KeyboardEvent;
				if (!isMobileMenuOpen.value) return;

				if (keyboardEvent.key === "Escape") {
					closeMobileMenu();
					return;
				}

				if (keyboardEvent.key !== "Tab") return;
				const menu = document.getElementById(mobileMenuId);
				if (!menu) return;
				const focusable = Array.from(
					menu.querySelectorAll<HTMLElement>(
						'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
					),
				);
				const first = focusable[0];
				const last = focusable.at(-1);
				if (!first || !last) return;

				if (keyboardEvent.shiftKey && document.activeElement === first) {
					keyboardEvent.preventDefault();
					last.focus();
				} else if (!keyboardEvent.shiftKey && document.activeElement === last) {
					keyboardEvent.preventDefault();
					first.focus();
				}
			}),
		);

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Scroll position and IntersectionObserver require browser DOM APIs.
		useVisibleTask$(({ cleanup }) => {
			updateScrollState();

			const sections = navLinks
				.map(
					(link) => link.sectionId && document.getElementById(link.sectionId),
				)
				.filter((section): section is HTMLElement => Boolean(section));
			if (sections.length === 0) return;

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) activeSection.value = entry.target.id;
						else if (activeSection.value === entry.target.id)
							activeSection.value = "";
					}
				},
				{ rootMargin: "-45% 0px -50% 0px" },
			);
			for (const section of sections) observer.observe(section);
			cleanup(() => observer.disconnect());
		});

		// biome-ignore lint/correctness/noQwikUseVisibleTask: Focus and scroll lock require browser DOM APIs.
		useVisibleTask$(({ track, cleanup }) => {
			track(() => isMobileMenuOpen.value);
			if (!isMobileMenuOpen.value) return;

			const previousOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			const focusFrame = requestAnimationFrame(() => {
				mobileMenuCloseRef.value?.focus();
			});

			cleanup(() => {
				document.body.style.overflow = previousOverflow;
				cancelAnimationFrame(focusFrame);
			});
		});

		const transparentOnPhone = isOverHero.value && !isMobileMenuOpen.value;

		return (
			<div class="drawer drawer-end">
				<input
					type="checkbox"
					class="drawer-toggle"
					aria-hidden="true"
					tabIndex={-1}
					bind:checked={isMobileMenuOpen}
				/>

				<div class="drawer-content">
					<header
						class={[
							"fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,color,box-shadow] duration-300 ease-(--ease-smooth) motion-reduce:transition-none",
							"lg:border-base-300 lg:bg-base-100/88 lg:text-base-content lg:backdrop-blur-md",
							transparentOnPhone
								? "border-transparent bg-transparent text-ink"
								: "border-base-300 bg-base-100 text-base-content",
							isScrolled.value
								? "lg:shadow-[0_6px_24px_-12px_rgb(26_36_26/0.25)]"
								: "",
						]}
					>
						<div
							class={[
								"mx-auto grid h-16 w-full max-w-360 grid-cols-[1fr_auto] items-center pr-2 pl-4.5 transition-[height] duration-300 ease-(--ease-smooth) motion-reduce:transition-none sm:pl-6 lg:grid-cols-[1fr_auto_1fr] lg:px-10 xl:px-16",
								isScrolled.value ? "lg:h-16" : "lg:h-20",
							]}
						>
							<a
								href={getLocaleNavLink(location.url.pathname, "#")}
								class="inline-flex min-h-11 items-center gap-2 justify-self-start lg:gap-2.5"
								aria-label={`Aesthetic Lab — ${t("app.nav.home@@Home")}`}
							>
								<BirdLogo
									class="h-6.5 w-auto [&_path]:fill-current lg:h-8"
									aria-hidden="true"
								/>
								<span class="font-qestero text-2xl leading-none lg:text-[1.875rem]">
									Aesthetic Lab
								</span>
							</a>

							<nav
								aria-label={t("app.nav.primary@@Primary navigation")}
								class="hidden lg:block"
							>
								<ul class="flex items-center gap-7 xl:gap-10">
									{navLinks
										.filter((item) => item.primary)
										.map((item) => {
											const isActive =
												Boolean(item.sectionId) &&
												activeSection.value === item.sectionId;
											return (
												<li key={item.key}>
													<a
														href={item.url}
														aria-current={isActive ? "location" : undefined}
														class={[
															"relative flex min-h-11 items-center font-main text-sm font-medium after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:bg-sage-600 after:transition-transform after:duration-300 after:ease-(--ease-smooth) hover:after:scale-x-100 motion-reduce:after:transition-none",
															isActive
																? "after:scale-x-100"
																: "after:scale-x-0",
														]}
													>
														{item.label}
													</a>
												</li>
											);
										})}
								</ul>
							</nav>

							<div class="flex items-center gap-1 justify-self-end lg:gap-3">
								<LanguageSwitcher />
								<Booking
									id="nav-book-btn"
									text={t("app.book.book_app@@Book Appointment")}
									analyticsPlacement="desktop_nav"
									classes="btn btn-neutral hidden h-12 min-h-12 px-6 font-main text-sm font-semibold lg:inline-flex"
								/>
								<button
									type="button"
									ref={mobileMenuToggleRef}
									class="btn btn-ghost btn-square drawer-button size-11 min-h-11 border-0 text-current hover:bg-transparent lg:hidden"
									aria-label={t("app.nav.open_menu@@Open menu")}
									aria-controls={mobileMenuId}
									aria-expanded={isMobileMenuOpen.value}
									onClick$={openMobileMenu}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.4"
										class="size-6"
										aria-hidden="true"
									>
										<path d="M3 9h18M3 15h18" />
									</svg>
								</button>
							</div>
						</div>
						<span
							ref={progressRef}
							aria-hidden="true"
							class="absolute inset-x-0 bottom-0 hidden h-0.5 origin-left scale-x-0 bg-primary lg:block"
						/>
					</header>
				</div>

				<div id={mobileMenuId} class="drawer-side z-120 lg:hidden">
					<button
						type="button"
						aria-label={t("app.nav.close_menu@@Close menu")}
						class="drawer-overlay"
						onClick$={closeMobileMenu}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby={mobileMenuTitleId}
						class="flex min-h-full w-full flex-col bg-primary pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-primary-content"
					>
						<div class="flex h-16 items-center justify-between border-b border-primary-content/30 pr-2 pl-4.5">
							<div class="flex items-center gap-2">
								<BirdLogo
									class="h-6.5 w-auto [&_path]:fill-current"
									aria-hidden="true"
								/>
								<h2
									id={mobileMenuTitleId}
									class="font-qestero text-2xl leading-none font-normal"
								>
									Aesthetic Lab
								</h2>
							</div>
							<button
								type="button"
								ref={mobileMenuCloseRef}
								class="btn btn-ghost btn-square size-11 min-h-11 border-0 text-current hover:bg-transparent"
								onClick$={closeMobileMenu}
								aria-label={t("app.nav.close_menu@@Close menu")}
								aria-controls={mobileMenuId}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									class="size-5.5"
									aria-hidden="true"
								>
									<path d="M5 5l14 14M19 5 5 19" />
								</svg>
							</button>
						</div>

						<nav
							class="px-5.5 pt-4"
							aria-label={t("app.nav.mobile_menu@@Mobile navigation")}
						>
							<ul>
								{navLinks.map((item, index) => (
									<li key={item.key}>
										<a
											href={item.url}
											class="flex min-h-15 items-center gap-4.5 border-b border-primary-content/25"
											onClick$={closeMobileMenu}
										>
											<span class="w-6 font-main text-[0.6875rem] font-semibold tracking-[0.14em]">
												{String(index + 1).padStart(2, "0")}
											</span>
											<span class="font-cormorant text-[2.375rem] leading-none">
												{item.label}
											</span>
										</a>
									</li>
								))}
							</ul>
						</nav>

						<div class="flex flex-col gap-5 px-5.5 pt-6">
							<Booking
								id="mobile-menu-book-btn"
								text={t("app.book.book_app@@Book Appointment")}
								analyticsPlacement="mobile_menu"
								classes="btn btn-neutral h-13 min-h-13 w-full font-main text-[0.9375rem] font-semibold"
							/>
							<nav
								aria-label={t("app.language.options@@Language options")}
								class="flex justify-between font-main text-xs font-semibold tracking-[0.14em]"
							>
								{localeLinks.map((locale) => (
									<a
										key={locale.lang}
										href={locale.href}
										hreflang={locale.lang}
										aria-label={locale.name}
										title={locale.name}
										aria-current={locale.isCurrent ? "true" : undefined}
										class={[
											"flex min-h-11 min-w-12 items-center justify-center border",
											locale.isCurrent
												? "border-primary-content"
												: "border-transparent",
										]}
										onClick$={() =>
											trackGoogleAnalyticsEvent("language_changed", {
												from_locale: currentLang,
												to_locale: locale.lang,
											})
										}
									>
										{locale.label}
									</a>
								))}
							</nav>
						</div>

						<div class="mt-auto flex items-end justify-between gap-4 border-t border-primary-content/30 px-5.5 pt-4.5 font-main text-[0.8125rem] leading-normal">
							<p>
								{SITE_METADATA.address.street}, {SITE_METADATA.address.city}
								<br />
								{t("app.contact.monday@@Mon")} –{" "}
								{t("app.contact.saturday@@Sat")} ·{" "}
								{SITE_METADATA.hours[0].opens} – {SITE_METADATA.hours[0].closes}
							</p>
							<a
								href={SITE_METADATA.socials.instagram}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex min-h-11 items-center font-semibold"
							>
								Instagram
							</a>
						</div>
					</div>
				</div>

				{bookingBar ? (
					<div
						class={[
							"fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-base-300 bg-base-100/97 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-sm transition-transform duration-300 ease-(--ease-smooth) motion-reduce:transition-none lg:hidden",
							showBookingBar.value
								? "translate-y-0"
								: "pointer-events-none translate-y-full",
						]}
						aria-hidden={!showBookingBar.value}
						inert={!showBookingBar.value}
					>
						<Booking
							id="bottom-bar-book-btn"
							text={t("app.book.book_app@@Book Appointment")}
							analyticsPlacement="mobile_bottom_bar"
							classes="btn btn-neutral h-13 min-h-13 flex-1 font-main text-[0.9375rem] font-semibold"
						/>
						<a
							href={googlePlaceUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={t("app.contact.directions@@Get Directions")}
							class="btn btn-outline btn-square size-13 min-h-13 border-neutral bg-base-100 hover:border-neutral hover:bg-neutral hover:text-neutral-content"
							onClick$={$(() => {
								trackGoogleAnalyticsEvent("directions_clicked", {
									placement: "mobile_bottom_bar",
									link_url: googlePlaceUrl,
								});
							})}
						>
							<HiMapPinOutline class="size-5" aria-hidden="true" />
						</a>
					</div>
				) : null}
			</div>
		);
	},
);
