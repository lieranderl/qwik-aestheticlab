import { component$ } from "@builder.io/qwik";
import { HiBars3Outline } from "@qwikest/icons/heroicons";
import {
	type InlineTranslateFn,
	inlineTranslate,
	localizePath,
	type SpeakLocale,
	useSpeakLocale,
} from "qwik-speak";
import { Booking } from "../booking-modal";
import { ChangeLocale } from "../change-locale";

const NAV_LINKS = (t: InlineTranslateFn, locale: SpeakLocale) => {
	const getPath = localizePath();
	return [
		{ href: getPath("/#home", locale.lang), text: t("app.nav.home@@Home") },
		{
			href: getPath("/#services", locale.lang),
			text: t("app.nav.services@@Services"),
		},
		{ href: getPath("/#team", locale.lang), text: t("app.nav.team@@Team") },
		{
			href: getPath("/#policy", locale.lang),
			text: t("app.nav.policy@@Policy"),
		},
		{ href: getPath("/#work", locale.lang), text: t("app.nav.work@@Work") },
		{ href: getPath("/#about", locale.lang), text: t("app.nav.about@@About") },
		{
			href: getPath("/#contact", locale.lang),
			text: t("app.nav.contact@@Contact"),
		},
	];
};

export default component$(() => {
	const t = inlineTranslate();
	const locale = useSpeakLocale();

	return (
		<header class="fixed w-full bg-primary/90 backdrop-blur-sm z-50">
			<div class="navbar px-4 xl:px-8">
				{/* --- Left (start) --- */}
				<div class="navbar-start"></div>

				{/* --- Center --- */}
				<div class="navbar-center">
					{/* Booking button (mobile only) */}
					<div class="xl:hidden">
						<Booking
							id="modal_location_header_mobile"
							text={t("app.book.book_now@@Book Now")}
							classes="btn text-nowrap"
							location="372146"
						/>
					</div>

					{/* Desktop nav links */}
					<ul class="menu menu-horizontal hidden xl:flex gap-4">
						{NAV_LINKS(t, locale).map(({ href, text }) => (
							<li key={href}>
								<a href={href} class="no-underline text-base-100">
									{text}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* --- Right (end) --- */}
				<div class="navbar-end gap-2">
					{/* Booking (desktop only) */}
					<div class="hidden xl:block">
						<Booking
							id="modal_location_header"
							text={t("app.book.book_now@@Book Now")}
							classes="btn text-nowrap"
							location="372146"
						/>
					</div>

					<ChangeLocale />

					{/* Mobile menu (daisyUI dropdown) */}
					<div class="dropdown dropdown-end xl:hidden">
						<div
							tabIndex={0}
							role="button"
							class="btn btn-primary btn-ghost btn-square"
						>
							<HiBars3Outline class="text-2xl text-base-100" />
						</div>
						<ul
							tabIndex={0}
							class="menu menu-compact dropdown-content mt-2 p-2 shadow bg-base-100/96 rounded-box w-52"
						>
							{NAV_LINKS(t, locale).map(({ href, text }) => (
								<li key={href}>
									<a href={href} class="no-underline">
										{text}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
});
