import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { Parallax } from "~/components/ui/parallax";
import { SITE_METADATA } from "~/constants/metadata";
import { googlePlaceUrl } from "~/consts";
import ReadyImage from "~/media/hero/taupe-manicure.jpg?jsx";
import { openCookieSettings } from "~/shared/cookie-consent";
import {
	getLocaleNavLink,
	getLocaleSwitchLinks,
} from "~/shared/locale-navigation";
import { getNavLinkKeys } from "~/shared/nav-links";

const columnLabel =
	"font-main text-[0.6875rem] font-semibold tracking-[0.22em] text-sage-700 uppercase";
const legalLink =
	"inline-flex min-h-11 items-center font-main text-xs text-base-content hover:underline";

interface FooterProps {
	/** The "Ready when you are" booking band above the footer. */
	readyBand?: boolean;
	/** Leave room for the phone booking bar (see Navigation). */
	bookingBar?: boolean;
}

const [emailName, emailDomain] = SITE_METADATA.email.split("@");

export const Footer = component$<FooterProps>(
	({ readyBand = true, bookingBar = true }) => {
		const t = inlineTranslate();
		const location = useLocation();
		const navLabels: Record<string, string> = {
			"app.nav.services@@Services": t("app.nav.services@@Services"),
			"app.nav.prices@@Prices": t("app.nav.prices@@Prices"),
			"app.nav.work@@Our Work": t("app.nav.work@@Our Work"),
			"app.nav.team@@Team": t("app.nav.team@@Team"),
			"app.nav.faq@@Good to know": t("app.nav.faq@@Good to know"),
			"app.nav.visit@@Visit": t("app.nav.visit@@Visit"),
		};
		const links = getNavLinkKeys().map(({ href, key }) => ({
			label: navLabels[key],
			href: getLocaleNavLink(location.url.pathname, href),
		}));
		const { street, zip, city } = SITE_METADATA.address;
		const { opens, closes } = SITE_METADATA.hours[0];

		return (
			<>
				{readyBand ? (
					<section
						aria-labelledby="ready-title"
						class="bg-base-200 px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-18 xl:px-28"
					>
						<div class="mx-auto grid max-w-7xl gap-7 md:grid-cols-2 md:items-stretch lg:gap-16">
							<figure class="relative h-60 overflow-hidden bg-sage-200 md:h-auto md:min-h-80">
								<Parallax
									mode="center"
									speed={0.15}
									class="absolute inset-x-0 -top-15 h-[calc(100%+7.5rem)]"
								>
									<ReadyImage
										alt={t(
											"app.footer.ready_image_alt@@Glossy taupe manicure resting on linen",
										)}
										class="h-full w-full object-cover object-[50%_45%]"
										loading="lazy"
										sizes="(min-width: 768px) 45vw, 100vw"
									/>
								</Parallax>
							</figure>
							<div class="flex flex-col justify-center gap-5 lg:gap-6">
								<FadeUp mask>
									<h2
										id="ready-title"
										class="font-cormorant text-[2.75rem] leading-[0.92] font-medium tracking-[-0.015em] text-ink md:text-6xl lg:text-[4.25rem]"
									>
										{t("app.footer.ready@@Ready when you are.")}
									</h2>
								</FadeUp>
								<FadeUp delay={100}>
									<p class="max-w-[26rem] font-main text-base leading-relaxed text-sage-700">
										{t(
											"app.footer.ready_note@@Pick a treatment and a time that suits you. Booking takes about a minute.",
										)}
									</p>
								</FadeUp>
								<FadeUp delay={200} class="flex flex-wrap items-center gap-6">
									<Booking
										id="footer-book-btn"
										text={t("app.book.book_app@@Book Appointment")}
										analyticsPlacement="footer"
										classes="btn btn-accent h-14 min-h-14 px-8 font-main text-[0.9375rem] font-semibold"
									/>
									<a
										href={getLocaleNavLink(location.url.pathname, "pricelist")}
										class="group inline-flex min-h-11 items-center gap-2.5 font-main text-[0.9375rem] font-semibold text-rosewood"
									>
										{t("app.hero.see_prices@@See prices")}
										<span
											aria-hidden="true"
											class="transition-transform duration-500 ease-(--ease-quint) group-hover:translate-x-1.5"
										>
											→
										</span>
									</a>
								</FadeUp>
							</div>
						</div>
					</section>
				) : null}

				<footer
					class={[
						"overflow-x-clip bg-sage-100 px-5.5 pt-12 text-ink md:px-10 lg:px-16 lg:pt-22 lg:pb-9 xl:px-28",
						bookingBar
							? "pb-[calc(env(safe-area-inset-bottom)+7.5rem)]"
							: "pb-[calc(env(safe-area-inset-bottom)+2.5rem)]",
					]}
				>
					<div class="mx-auto flex max-w-7xl flex-col gap-8 lg:gap-12">
						{/* Phones: the contact column is a little wider so the email fits one line. */}
						<div class="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-12">
							<div class="flex flex-col gap-2 border-t border-ink pt-3 font-main text-sm leading-normal lg:gap-3.5 lg:pt-3.5 lg:text-[0.9375rem]">
								<h2 class={columnLabel}>{t("app.footer.studio@@Studio")}</h2>
								<p>
									{street}
									<br />
									{zip} {city}
								</p>
								<p>
									{t("app.contact.monday@@Monday")} –{" "}
									{t("app.contact.saturday@@Saturday")}
									{/* Phones: hours on their own line in the narrower column. */}
									<span class="max-lg:hidden"> · </span>
									<br class="lg:hidden" />
									<span class="whitespace-nowrap">
										{opens} – {closes}
									</span>
									<br />
									{t("app.contact.appointment_only@@By appointment only")}
								</p>
								<a
									href={googlePlaceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex min-h-11 items-center self-start text-[0.6875rem] font-semibold tracking-[0.18em] uppercase underline underline-offset-5 lg:text-xs"
								>
									{t("app.contact.directions@@Directions")}
								</a>
							</div>

							<div class="flex flex-col gap-2 border-t border-ink pt-3 font-main text-sm lg:gap-3.5 lg:pt-3.5 lg:text-[0.9375rem]">
								<h2 class={columnLabel}>{t("app.contact.contact@@Contact")}</h2>
								<a
									href={`mailto:${SITE_METADATA.email}`}
									class="inline-block py-3 hover:underline lg:py-0"
								>
									{/* Narrow phones: wrap at the @, never mid-word. */}
									{emailName}
									<wbr />@{emailDomain}
								</a>
								<a
									href={SITE_METADATA.socials.instagram}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex min-h-11 items-center gap-2 hover:underline lg:min-h-0"
								>
									<SiInstagram class="size-4" aria-hidden="true" />
									@aestheticlabbe
								</a>
							</div>

							<nav
								aria-label={t("app.footer.navigation@@Footer navigation")}
								class="col-span-2 border-t border-ink pt-3 font-main text-sm lg:col-span-1 lg:pt-3.5 lg:text-[0.9375rem]"
							>
								<h2 class={[columnLabel, "mb-2 lg:mb-3.5"]}>
									{t("app.footer.explore@@Explore")}
								</h2>
								<ul class="grid grid-cols-2 lg:grid-cols-1 lg:gap-2">
									{links.map((item) => (
										<li key={item.href}>
											<a
												href={item.href}
												class="flex min-h-11 items-center border-b border-sage-300 hover:underline lg:min-h-0 lg:border-0"
											>
												{item.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						</div>

						<p
							aria-hidden="true"
							class="drift-word font-qestero text-[clamp(4.5rem,19vw,17.5rem)] leading-[0.85] whitespace-nowrap text-sage-300 select-none"
						>
							Aesthetic Lab
						</p>

						<div class="flex flex-col gap-2.5 border-t border-sage-300 pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pt-5">
							<p class="order-last font-main text-xs text-sage-700 lg:order-first">
								&copy; {new Date().getFullYear()} Aesthetic Lab Leuven
							</p>
							<nav
								aria-label={t("app.footer.legal@@Legal")}
								class="flex flex-wrap gap-x-6 lg:gap-x-7"
							>
								<a
									class={legalLink}
									href={getLocaleNavLink(
										location.url.pathname,
										"privacy-policy",
									)}
								>
									{t("app.privacy.privacy_title@@Privacy Policy")}
								</a>
								<a
									class={legalLink}
									href={getLocaleNavLink(location.url.pathname, "notice")}
								>
									{t("app.care.title@@Care notes")}
								</a>
								<button
									type="button"
									class={[legalLink, "cursor-pointer"]}
									onClick$={() => openCookieSettings()}
								>
									{t("app.cookies.settings@@Cookie settings")}
								</button>
							</nav>
							<nav
								aria-label={t("app.language.options@@Language options")}
								class="flex justify-between gap-1 font-main text-xs font-semibold tracking-[0.14em] lg:justify-start"
							>
								{getLocaleSwitchLinks(location.url.pathname).map((locale) => (
									<a
										key={locale.lang}
										href={locale.href}
										hreflang={locale.lang}
										aria-label={locale.name}
										title={locale.name}
										aria-current={locale.isCurrent ? "true" : undefined}
										class={[
											"flex min-h-11 min-w-11 items-center justify-center border lg:min-h-9 lg:min-w-9 lg:border-0",
											locale.isCurrent
												? "border-neutral lg:underline lg:underline-offset-4"
												: "border-transparent text-sage-700 hover:text-base-content",
										]}
									>
										{locale.label}
									</a>
								))}
							</nav>
						</div>
					</div>
				</footer>
			</>
		);
	},
);
