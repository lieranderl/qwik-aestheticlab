import {
	$,
	component$,
	useOnWindow,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { LanguageSwitcher } from "~/components/ui/language-switcher";
import BirdLogo from "~/media/Bird.svg?jsx";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const Navigation = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	const isScrolled = useSignal(false);
	const isMobileMenuOpen = useSignal(false);
	const mobileMenuToggleRef = useSignal<HTMLButtonElement>();
	const mobileMenuCloseRef = useSignal<HTMLButtonElement>();
	const mobileMenuId = "mobile-navigation-menu";
	const mobileMenuTitleId = `${mobileMenuId}-title`;

	const closeMobileMenu = $(() => {
		isMobileMenuOpen.value = false;
		requestAnimationFrame(() => mobileMenuToggleRef.value?.focus());
	});

	// Inline nav links to avoid Qwik serialization issues with t function
	const navLinks = [
		{ label: t("app.nav.home@@Home"), href: "#" },
		{ label: t("app.nav.services@@Services"), href: "#services" },
		{ label: t("app.nav.team@@Team"), href: "#team" },
		{ label: t("app.work.title@@Gallery"), href: "#gallery" },
		{ label: t("app.nav.about@@About"), href: "#about" },
		{ label: t("app.nav.contact@@Contact"), href: "#contact" },
	];

	useOnWindow(
		"scroll",
		$(() => {
			isScrolled.value = window.scrollY > 50;
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

	const headerTextColorClass = "text-primary";
	const navTextColorClass = "text-primary";

	const bookingBtnClass = isScrolled.value
		? "btn btn-primary uppercase tracking-wider font-medium"
		: "btn btn-primary btn-outline uppercase tracking-wider font-medium";

	return (
		<>
			<header
				class={`fixed top-0 right-0 left-0 z-100 py-3 transition-[background-color,box-shadow] duration-200 md:py-4 ${headerTextColorClass} ${
					isScrolled.value ? "bg-base-200/95 shadow-sm" : "bg-transparent"
				}`}
			>
				<div class="navbar custom-container relative min-h-0 p-0">
					{/* Logo - Left Section (Bird Only) */}
					<div class="navbar-start w-auto min-w-0 flex-1">
						<a
							href={getLocaleNavLink(location.url.pathname, "#")}
							class="flex items-center gap-2 transition-opacity hover:opacity-80"
						>
							<BirdLogo
								class={`h-12 w-auto md:h-16 [&_path]:fill-current ${headerTextColorClass}`}
								aria-label={t("app.nav.logo_bird@@Aesthetic Lab Bird Logo")}
							/>
						</a>
					</div>

					{/* Center Section: Desktop Nav */}
					<div class="navbar-center flex-none">
						<nav aria-label={t("app.nav.primary@@Primary navigation")}>
							<ul class="menu menu-horizontal hidden w-max flex-nowrap! items-center gap-0 p-0 lg:flex">
								{navLinks.map((item) => (
									<li key={item.label} class="flex items-center">
										<a
											href={getLocaleNavLink(location.url.pathname, item.href)}
											class={`flex h-11 min-h-11 items-center justify-center rounded-full px-4 py-0 text-center font-montserrat text-sm font-medium leading-none tracking-wide whitespace-nowrap transition-colors duration-150 hover:text-secondary/70 ${navTextColorClass}`}
										>
											{item.label}
										</a>
									</li>
								))}
							</ul>
						</nav>

						{/* Mobile Booking Button - Absolutely centered in the screen */}
						<div class="hidden min-[375px]:block lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<Booking
								id="mobile-nav-book-btn"
								text={t("app.book.book_now@@Book Now")}
								location="372146"
								analyticsPlacement="mobile_nav"
								classes={bookingBtnClass}
							/>
						</div>
					</div>

					{/* Right Section: Desktop Actions / Mobile Hamburger */}
					<div class="navbar-end w-auto min-w-0 flex-1 gap-1 lg:gap-4">
						{/* Desktop Actions */}
						<div class="hidden lg:flex items-center gap-4">
							<Booking
								id="nav-book-btn"
								text={t("app.book.book_now@@Book Now")}
								location="372146"
								analyticsPlacement="desktop_nav"
								classes={bookingBtnClass}
							/>
							<LanguageSwitcher />
						</div>

						{/* Mobile Elements */}
						<div class="flex items-center gap-1 lg:hidden">
							<LanguageSwitcher />
							<button
								type="button"
								ref={mobileMenuToggleRef}
								class={`btn btn-ghost btn-square min-h-11 min-w-11 transition-colors duration-150 ${
									isMobileMenuOpen.value ? "hidden" : "block"
								}`}
								onClick$={$(() => {
									isMobileMenuOpen.value = !isMobileMenuOpen.value;
								})}
								aria-label={t("app.nav.open_menu@@Open menu")}
								aria-controls={mobileMenuId}
								aria-expanded={isMobileMenuOpen.value}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width={1.5}
									stroke="currentColor"
									class="size-6"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{isMobileMenuOpen.value ? (
				<div
					id={mobileMenuId}
					role="dialog"
					aria-modal="true"
					aria-labelledby={mobileMenuTitleId}
					class="fixed inset-0 z-120 flex flex-col items-center justify-center gap-8 overflow-y-auto bg-base-200 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:hidden"
				>
					<h2 id={mobileMenuTitleId} class="sr-only">
						{t("app.nav.mobile_menu@@Mobile navigation")}
					</h2>
					{/* Close Button inside Menu */}
					<button
						type="button"
						ref={mobileMenuCloseRef}
						class="btn btn-ghost btn-square absolute top-6 right-6 min-h-11 min-w-11 transition-colors duration-150"
						onClick$={closeMobileMenu}
						aria-label={t("app.nav.close_menu@@Close menu")}
						aria-controls={mobileMenuId}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width={1.5}
							stroke="currentColor"
							class="size-8"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<ul class="menu menu-lg mt-16 items-center gap-2 p-0 text-center">
						{navLinks.map((item) => (
							<li key={item.label}>
								<a
									href={getLocaleNavLink(location.url.pathname, item.href)}
									class="min-h-12 font-qestero text-3xl"
									onClick$={closeMobileMenu}
								>
									{item.label}
								</a>
							</li>
						))}
						<li>
							<LanguageSwitcher />
						</li>
					</ul>
				</div>
			) : null}
		</>
	);
});
