import {
	$,
	component$,
	useOnWindow,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HiBars3Outline, HiXMarkOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { LanguageSwitcher } from "~/components/ui/language-switcher";

import BirdLogo from "~/media/Bird.svg?jsx";
import { getLocaleNavLink } from "~/shared/locale-navigation";
import { getNavLinkKeys } from "~/shared/nav-links";

export const Navigation = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	const isScrolled = useSignal(false);
	const isMobileMenuOpen = useSignal(false);
	const showMobileBookNow = useSignal(false);
	const mobileMenuToggleRef = useSignal<HTMLButtonElement>();
	const mobileMenuCloseRef = useSignal<HTMLButtonElement>();
	const mobileMenuId = "mobile-navigation-menu";
	const mobileMenuTitleId = `${mobileMenuId}-title`;

	const navLabels: Record<string, string> = {
		"app.nav.home@@Home": t("app.nav.home@@Home"),
		"app.nav.services@@Services": t("app.nav.services@@Services"),
		"app.nav.reviews@@Reviews": t("app.nav.reviews@@Reviews"),
		"app.nav.work@@Our Work": t("app.nav.work@@Our Work"),
		"app.nav.team@@Team": t("app.nav.team@@Team"),
		"app.faq.title@@FAQ": t("app.faq.title@@FAQ"),
		"app.nav.contact@@Contact": t("app.nav.contact@@Contact"),
	};
	const navLinks = getNavLinkKeys().map(({ href, key }) => ({
		label: navLabels[key],
		href,
	}));

	const closeMobileMenu = $(() => {
		isMobileMenuOpen.value = false;
		requestAnimationFrame(() => mobileMenuToggleRef.value?.focus());
	});
	const openMobileMenu = $(() => {
		isMobileMenuOpen.value = true;
	});

	useOnWindow(
		"scroll",
		$(() => {
			isScrolled.value = window.scrollY > 24;
		}),
	);

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

	// biome-ignore lint/correctness/noQwikUseVisibleTask: IntersectionObserver requires browser DOM APIs.
	useVisibleTask$(({ cleanup }) => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.target.id === "hero") {
						showMobileBookNow.value = !entry.isIntersecting;
					}
				}
			},
			{ threshold: 0 },
		);

		const hero = document.getElementById("hero");
		if (hero) observer.observe(hero);

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
					class={`fixed inset-x-0 top-0 z-40 border-b border-primary-content/10 bg-primary/98 py-2 backdrop-blur-md transition-shadow duration-300 md:py-3 ${isScrolled.value ? "shadow-md" : ""}`}
				>
					<div class="navbar mx-auto min-h-14 w-full max-w-7xl px-4 py-0 sm:px-6 md:min-h-16 lg:px-6 xl:px-8">
						<div class="navbar-start min-w-0">
							<a
								href={getLocaleNavLink(location.url.pathname, "#")}
								class="inline-flex min-h-11 items-center gap-2"
								aria-label={`${t("app.nav.logo_bird@@Aesthetic Lab Bird Logo")} — ${t("app.nav.home@@Home")}`}
							>
								<BirdLogo
									class="h-8 w-auto text-primary-content md:h-10 [&_path]:fill-current"
									aria-hidden="true"
								/>
								<span class="hidden font-qestero text-xl leading-none tracking-wide text-primary-content sm:block">
									Aesthetic Lab
								</span>
							</a>
						</div>

						<div class="navbar-center">
							<nav
								aria-label={t("app.nav.primary@@Primary navigation")}
								class="hidden lg:block"
							>
								<ul class="menu menu-horizontal flex-nowrap items-center gap-0.5 p-0 [&_a:hover]:bg-transparent [&_a:focus]:bg-transparent">
									{navLinks.map((item) => (
										<li key={item.label}>
											<a
												href={getLocaleNavLink(
													location.url.pathname,
													item.href,
												)}
												class="relative flex h-11 min-h-11 items-center justify-center rounded-field px-3 py-0 font-main text-xs font-medium leading-none text-primary-content after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-primary-content/40 after:transition-transform after:duration-200 hover:after:scale-x-100 xl:px-4 xl:after:left-4 xl:after:right-4"
											>
												{item.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
							<div class="lg:hidden">
								{showMobileBookNow.value && (
									<Booking
										id="nav-book-btn-mobile"
										text={t("app.book.book_now@@Book Now")}
										analyticsPlacement="mobile_nav_center"
										classes="btn btn-outline btn-sm min-h-8 border-primary-content/30 px-4 font-main text-xs font-semibold uppercase tracking-[0.08em] text-primary-content"
									/>
								)}
							</div>
						</div>

						<div class="navbar-end min-w-0 gap-1 md:gap-2">
							<div class="hidden items-center gap-2 lg:flex">
								<LanguageSwitcher />
								<Booking
									id="nav-book-btn"
									text={t("app.book.book_now@@Book Now")}
									analyticsPlacement="desktop_nav"
									classes="btn btn-neutral btn-sm min-h-11 px-5 font-main text-xs font-semibold uppercase tracking-[0.08em] transition-shadow duration-300 ease-out motion-safe:hover:shadow-md"
								/>
							</div>

							<div class="flex items-center gap-1 lg:hidden">
								<LanguageSwitcher />
								<button
									type="button"
									ref={mobileMenuToggleRef}
									class="btn btn-ghost btn-square drawer-button min-h-11 min-w-11 text-primary-content"
									aria-label={t("app.nav.open_menu@@Open menu")}
									aria-controls={mobileMenuId}
									aria-expanded={isMobileMenuOpen.value}
									onClick$={openMobileMenu}
								>
									<HiBars3Outline class="size-6" aria-hidden="true" />
								</button>
							</div>
						</div>
					</div>
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
					class="flex min-h-full w-full flex-col bg-primary px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-primary-content"
				>
					<div class="flex min-h-14 items-center justify-between border-b border-primary-content/15 pb-3">
						<div class="flex items-center gap-3">
							<BirdLogo
								class="h-9 w-auto [&_path]:fill-current text-primary-content"
								aria-hidden="true"
							/>
							<h2
								id={mobileMenuTitleId}
								class="font-qestero text-2xl text-primary-content"
							>
								Aesthetic Lab
							</h2>
						</div>
						<button
							type="button"
							ref={mobileMenuCloseRef}
							class="btn btn-ghost btn-square min-h-11 min-w-11 border border-primary-content/20 bg-primary-content/5 text-primary-content shadow-sm"
							onClick$={closeMobileMenu}
							aria-label={t("app.nav.close_menu@@Close menu")}
							aria-controls={mobileMenuId}
						>
							<HiXMarkOutline class="size-7" aria-hidden="true" />
						</button>
					</div>

					<nav
						class="flex items-start py-8"
						aria-label={t("app.nav.mobile_menu@@Mobile navigation")}
					>
						<ul class="menu w-full gap-1 p-0">
							{navLinks.map((item, index) => (
								<li key={item.label}>
									<a
										href={getLocaleNavLink(location.url.pathname, item.href)}
										class="grid min-h-14 grid-cols-[2.5rem_minmax(0,1fr)] items-center rounded-none border-b border-primary-content/15 px-0 font-cormorant text-3xl leading-tight text-primary-content"
										onClick$={closeMobileMenu}
									>
										<span class="font-main text-[0.65rem] text-primary-content">
											{String(index + 1).padStart(2, "0")}
										</span>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<Booking
						id="mobile-menu-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						analyticsPlacement="mobile_menu"
						classes="btn btn-neutral btn-lg min-h-12 w-full font-main text-xs font-semibold uppercase tracking-[0.1em]"
					/>
				</div>
			</div>
		</div>
	);
});
