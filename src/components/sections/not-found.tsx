import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HiArrowLongRightOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { KickerLabel } from "~/components/ui/kicker-label";
import NotFoundImage from "~/media/gallery/white-shimmer.jpg?jsx";
import {
	getLocaleNavLink,
	resolveRequestLocale,
} from "~/shared/locale-navigation";

/**
 * Branded page for unknown URLs (served with a 404 status by the layout).
 */
export const NotFoundPage = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	// Links must point at a real locale, not at the unknown path itself.
	const localeHome = `/${resolveRequestLocale(location.params.lang)}/`;
	const links = [
		{
			href: "#services",
			label: t("app.nav.services@@Services"),
			note: t("app.not_found.services_note@@Nails, brows, lashes and laser"),
		},
		{
			href: "pricelist",
			label: t("app.nav.prices@@Prices"),
			note: t("app.not_found.prices_note@@Every treatment, time and price"),
		},
		{
			href: "#contact",
			label: t("app.nav.visit@@Visit"),
			note: t("app.not_found.visit_note@@Diestsestraat 174, Leuven"),
		},
	].map((link) => ({ ...link, href: getLocaleNavLink(localeHome, link.href) }));

	return (
		<div class="min-h-screen bg-base-100 text-base-content">
			{/* The page has its own Book button, so no phone booking bar. */}
			<Navigation bookingBar={false} />
			<main
				id="main-content"
				tabIndex={-1}
				class="grid pt-16 lg:min-h-svh lg:grid-cols-2 lg:pt-20"
			>
				<figure class="h-72 overflow-hidden bg-sage-200 sm:h-96 lg:h-auto">
					<NotFoundImage
						alt={t(
							"app.not_found.image_alt@@White shimmer manicure resting on soft green wool",
						)}
						class="h-full w-full object-cover object-[50%_45%]"
						loading="eager"
						sizes="(min-width: 1024px) 50vw, 100vw"
					/>
				</figure>
				<div class="flex flex-col justify-center gap-10 bg-sage-200 px-5.5 pt-8 pb-14 md:px-10 lg:gap-12 lg:px-20 xl:px-28">
					<div class="flex flex-col gap-4 lg:gap-6">
						<FadeUp>
							<KickerLabel class="mb-0">
								{t("app.not_found.kicker@@Page not found · 404")}
							</KickerLabel>
						</FadeUp>
						<FadeUp mask delay={80}>
							<h1 class="max-w-[12ch] font-cormorant text-[2.75rem] leading-[0.98] md:text-6xl lg:text-7xl">
								{t("app.not_found.title@@This page has moved on")}
							</h1>
						</FadeUp>
						<FadeUp delay={160} class="flex flex-col gap-6">
							<p class="max-w-md font-main text-[0.9375rem] leading-relaxed lg:text-base">
								{t(
									"app.not_found.body@@The link may be old. Everything you need is one tap away.",
								)}
							</p>
							<Booking
								id="not-found-book-btn"
								text={t("app.book.book_app@@Book Appointment")}
								analyticsPlacement="not_found"
								classes="btn btn-neutral h-13 min-h-13 px-8 font-main text-[0.9375rem] font-semibold sm:self-start"
							/>
						</FadeUp>
					</div>
					<FadeUp delay={240}>
						<nav aria-label={t("app.not_found.popular@@Popular pages")}>
							<ul class="max-w-md border-t border-neutral">
								{links.map((link) => (
									<li key={link.href} class="border-b border-neutral/25">
										<a
											href={link.href}
											class="group flex min-h-16 items-center justify-between gap-4 py-3"
										>
											<span class="flex flex-col gap-0.5">
												<span class="font-main text-base font-semibold">
													{link.label}
												</span>
												<span class="font-main text-sm text-base-content/75">
													{link.note}
												</span>
											</span>
											<HiArrowLongRightOutline
												class="size-6 shrink-0 transition-transform duration-500 ease-(--ease-quint) group-hover:translate-x-1.5 motion-reduce:transition-none"
												aria-hidden="true"
											/>
										</a>
									</li>
								))}
							</ul>
						</nav>
					</FadeUp>
				</div>
			</main>
			<Footer readyBand={false} bookingBar={false} />
		</div>
	);
});
