import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";
import { BookingBtn } from "../booking-button";
import { ChangeLocale } from "../change-locale";
import { inlineTranslate, InlineTranslateFn } from "qwik-speak";

const NAV_LINKS = (t: InlineTranslateFn) => {
	return [
		{ href: "/#home", text: t("app.nav.home@@Home") },
		{ href: "/#services", text: t("app.nav.services@@Services") },
		{ href: "/#team", text: t("app.nav.team@@Team") },
		{ href: "/#work", text: t("app.nav.work@@Work") },
		{ href: "/#about", text: t("app.nav.about@@About") },
		{ href: "/#contact", text: t("app.nav.contact@@Contact") },
	]
};

export default component$(() => {
	const isMenuOpen = useSignal(false);
	const menuRef = useSignal<HTMLDivElement>();
	const buttonRef = useSignal<HTMLButtonElement>();
	const t = inlineTranslate();

	// Memoized click handler
	const toggleMenu = $(() => {
		isMenuOpen.value = !isMenuOpen.value;
	});

	// Handle click outside
	useOnDocument(
		"click",
		$((event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				isMenuOpen.value &&
				menuRef.value &&
				!menuRef.value.contains(target) &&
				buttonRef.value &&
				!buttonRef.value.contains(target)
			) {
				isMenuOpen.value = false;
			}
		}),
	);

	return (
		<header class="fixed w-full bg-primary/90 backdrop-blur-sm z-50">
			<nav class="custom-container py-2">
				<div class="flex items-center justify-between h-12">
					<div />
					{/* Desktop Navigation */}
					<div class="hidden md:flex flex-1 items-center justify-center space-x-6">
						{NAV_LINKS(t).map(({ href, text }) => (
							<a
								key={href}
								href={href}
								class="link no-underline text-base-100 hover:text-base-100/80 transition-colors"
							>
								{text}
							</a>
						))}
					</div>
					<div class="hidden md:block">
						<BookingBtn additionalClasses="btn-md" myText={t('app.book.book_now@@Book Now')} />
					</div>
					<ChangeLocale />
					{/* Mobile menu button */}
					<button
						type="button"
						ref={buttonRef}
						onClick$={toggleMenu}
						class="md:hidden"
						aria-label="Toggle menu"
					>
						<div class="w-6 h-5 relative flex flex-col justify-between">
							<span
								class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "rotate-45 translate-y-2" : ""
									}`}
							/>
							<span
								class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "opacity-0" : ""
									}`}
							/>
							<span
								class={`w-full h-0.5 bg-base-100 transition-all duration-300 ${isMenuOpen.value ? "-rotate-45 -translate-y-2" : ""
									}`}
							/>
						</div>
					</button>
				</div>

				{/* Mobile Navigation */}
				<div
					ref={menuRef}
					class={`md:hidden ${isMenuOpen.value ? "block" : "hidden"} p-4 pb-2`}
				>
					<div class="flex flex-col space-y-3 items-end">
						{NAV_LINKS(t).map(({ href, text }) => (
							<a
								key={href}
								href={href}
								onClick$={toggleMenu}
								class="link no-underline text-base-100 text-right hover:text-base-100/80 transition-colors"
							>
								{text}
							</a>
						))}
					</div>
				</div>
			</nav>
		</header>
	);
});
