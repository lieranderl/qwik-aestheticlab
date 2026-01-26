import {
	$,
	component$,
	useOnWindow,
	useSignal,
	useTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { LanguageSwitcher } from "~/components/ui/language-switcher";
import { getLocaleNavLink } from "~/shared/locale-navigation";

interface NavigationProps {
	lightOnTransparent?: boolean;
}

export const Navigation = component$<NavigationProps>(
	({ lightOnTransparent }) => {
		const t = inlineTranslate();
		const location = useLocation();
		const isScrolled = useSignal(false);
		const isMobileMenuOpen = useSignal(false);

		// Inline nav links to avoid Qwik serialization issues with t function
		const navLinks = [
			{ label: t("app.nav.home@@Home"), href: "#" },
			{ label: t("app.nav.about@@About"), href: "#about" },
			{ label: t("app.nav.services@@Services"), href: "#services" },
			{ label: t("app.nav.team@@Team"), href: "#team" },
			{ label: t("app.work.title@@Gallery"), href: "#gallery" },
			{ label: t("app.nav.contact@@Contact"), href: "#contact" },
		];

		useOnWindow(
			"scroll",
			$(() => {
				isScrolled.value = window.scrollY > 50;
			}),
		);

		// Lock body scroll when mobile menu is open
		useTask$(({ track }) => {
			track(() => isMobileMenuOpen.value);
			if (typeof window !== "undefined") {
				if (isMobileMenuOpen.value) {
					document.body.style.overflow = "hidden";
				} else {
					document.body.style.overflow = "";
				}
			}
		});

		const navTextColorClass = "text-black";

		return (
			<>
				<header
					class={`fixed left-0 right-0 top-0 z-100 transition-all duration-300 ${
						isScrolled.value
							? "bg-base-100/90 py-2 shadow-sm backdrop-blur-md"
							: "bg-transparent py-3 md:py-5"
					}`}
				>
					<div class="custom-container relative flex items-center justify-between">
						{/* Logo - Left Section (Bird Only) */}
						<div class="flex items-center min-w-[120px]">
							<a
								href={getLocaleNavLink(location.url.pathname, "#")}
								class="flex items-center gap-2 transition-opacity hover:opacity-80"
							>
								<img
									src="/media/Bird.svg"
									alt="Aesthetic Lab Bird"
									class="h-12 w-auto md:h-16"
									width="64"
									height="64"
								/>
							</a>
						</div>

						{/* Center Section: Desktop Nav */}
						<div class="flex-1 flex items-center justify-center">
							<nav class="hidden lg:flex items-center gap-6">
								{navLinks.map((item) => (
									<a
										key={item.label}
										href={getLocaleNavLink(location.url.pathname, item.href)}
										class={`font-montserrat text-sm font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap ${navTextColorClass}`}
									>
										{item.label}
									</a>
								))}
							</nav>

							{/* Mobile Booking Button - Absolutely centered in the screen */}
							<div class="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<Booking
									id="mobile-nav-book-btn"
									text={t("app.book.book_now@@Book Now")}
									location="372146"
									classes={`rounded-full border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest shadow-md transition-all whitespace-nowrap ${
										isScrolled.value
											? "border-primary bg-primary text-white"
											: lightOnTransparent
												? "border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm"
												: "border-base-content text-base-content hover:bg-base-content hover:text-white backdrop-blur-sm"
									}`}
								/>
							</div>
						</div>

						{/* Right Section: Desktop Actions / Mobile Hamburger */}
						<div class="flex items-center justify-end gap-3 min-w-[120px]">
							{/* Desktop Actions */}
							<div class="hidden lg:flex items-center gap-4">
								<Booking
									id="nav-book-btn"
									text={t("app.book.book_now@@Book Now")}
									location="372146"
									classes={`rounded-full border px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${
										isScrolled.value
											? "border-primary bg-primary text-white hover:bg-[#7a8876]"
											: lightOnTransparent
												? "border-white text-white hover:bg-white hover:text-primary"
												: "border-base-content text-base-content hover:bg-base-content hover:text-white"
									}`}
								/>
								<LanguageSwitcher buttonClass={navTextColorClass} />
							</div>

							{/* Mobile Elements */}
							<div class="flex items-center gap-1 lg:hidden">
								<LanguageSwitcher buttonClass={navTextColorClass} />
								<button
									type="button"
									class={`text-black p-2 transition-transform hover:scale-110 ${
										isMobileMenuOpen.value ? "hidden" : "block"
									}`}
									onClick$={() => {
										isMobileMenuOpen.value = !isMobileMenuOpen.value;
									}}
									aria-label="Open menu"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width={1.5}
										stroke="currentColor"
										class="w-6 h-6"
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

				{/* Mobile Menu Overlay */}
				<div
					class={`fixed inset-0 z-110 bg-[#f4f5f1] flex flex-col items-center justify-center gap-8 transition-transform duration-300 overflow-y-auto lg:hidden ${isMobileMenuOpen.value ? "translate-x-0" : "translate-x-full"}`}
				>
					{/* Close Button inside Menu */}
					<button
						type="button"
						class="absolute top-6 right-6 p-2 text-base-content hover:scale-110 transition-transform"
						onClick$={() => {
							isMobileMenuOpen.value = false;
						}}
						aria-label="Close menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width={1.5}
							stroke="currentColor"
							class="w-8 h-8"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<ul class="flex flex-col items-center gap-8 mt-16">
						{navLinks.map((item) => (
							<li key={item.label}>
								<a
									href={getLocaleNavLink(location.url.pathname, item.href)}
									class="font-qestero text-3xl text-base-content"
									onClick$={() => {
										isMobileMenuOpen.value = false;
									}}
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
			</>
		);
	},
);
