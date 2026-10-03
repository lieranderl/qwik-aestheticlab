import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { KickerLabel } from "~/components/ui/kicker-label";
import { Parallax } from "~/components/ui/parallax";
import { SITE_METADATA } from "~/constants/metadata";
import { googlePlaceUrl } from "~/consts";
import VisitImage from "~/media/gallery/universal.jpg?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import type { Contact } from "~/types";

interface ContactSectionProps {
	contact: Contact | null;
}

const factRow =
	"flex justify-between gap-4 border-b border-primary-content/30 py-3 font-main text-sm lg:flex-col lg:justify-start lg:gap-2.5 lg:border-0 lg:border-t lg:border-primary-content lg:pt-4 lg:pb-0 lg:text-base";
const factLabel =
	"lg:text-[0.6875rem] lg:font-semibold lg:tracking-[0.22em] lg:uppercase";
const outlineAction =
	"btn btn-outline h-13 min-h-13 border-primary-content px-4.5 font-main text-[0.9375rem] font-semibold text-primary-content hover:bg-primary-content hover:text-sage-200 lg:h-14 lg:min-h-14 lg:px-5 lg:text-xs lg:tracking-[0.14em]";

export const ContactSection = component$<ContactSectionProps>(({ contact }) => {
	const t = inlineTranslate();
	// Fall back to the published studio details when Supabase is unavailable.
	const address =
		contact?.location.address ??
		`${SITE_METADATA.address.street}, ${SITE_METADATA.address.zip} ${SITE_METADATA.address.city}`;
	const [street, ...cityParts] = address.split(", ");
	const city = cityParts.join(", ");
	const directionsUrl = contact?.location.link || googlePlaceUrl;
	const email = contact?.email || SITE_METADATA.email;
	const opens = contact?.open_hours.from ?? SITE_METADATA.hours[0].opens;
	const closes = contact?.open_hours.to ?? SITE_METADATA.hours[0].closes;
	const days = `${t("app.contact.monday@@Monday")} – ${t("app.contact.saturday@@Saturday")}`;
	const parking = contact?.parking ?? [];

	return (
		<section
			id="contact"
			aria-labelledby="contact-title"
			class="scroll-mt-16 bg-sage-200 text-primary-content lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)]"
		>
			<figure class="relative h-42.5 overflow-hidden lg:order-last lg:h-auto">
				<Parallax
					mode="center"
					speed={0.15}
					class="absolute inset-x-0 -top-15 h-[calc(100%+7.5rem)]"
				>
					<VisitImage
						alt={t(
							"app.contact.image_alt@@Silver manicure holding an Aesthetic Lab card",
						)}
						class="h-full w-full object-cover object-[60%_45%] lg:object-[60%_center]"
						loading="lazy"
						sizes="(min-width: 1024px) 34rem, 100vw"
					/>
				</Parallax>
			</figure>

			<div class="flex flex-col gap-4.5 px-5.5 pt-6.5 pb-16 md:px-10 md:py-20 lg:min-h-[46rem] lg:gap-10 lg:py-26 lg:pr-24 lg:pl-16 xl:pl-28">
				<FadeUp>
					<KickerLabel tone="sage">
						{t("app.contact.visit_kicker@@Visit the studio")}
					</KickerLabel>
					<h2
						id="contact-title"
						class="font-cormorant text-[2.5rem] leading-none md:text-6xl lg:text-[clamp(3.5rem,5.5vw,5rem)] lg:leading-[0.95]"
					>
						{city ? (
							<>
								{street},
								<br />
								{city}
							</>
						) : (
							// Addresses without ", " are shown whole.
							street
						)}
					</h2>
				</FadeUp>

				<FadeUp delay={80}>
					<dl class="border-t border-primary-content lg:grid lg:grid-cols-3 lg:gap-8 lg:border-0">
						<div class={factRow}>
							<dt class={factLabel}>
								<span class="lg:hidden">{days}</span>
								<span class="hidden lg:inline">
									{t("app.contact.opening_hours@@Hours")}
								</span>
							</dt>
							<dd class="text-right lg:text-left lg:leading-normal">
								<span class="hidden lg:inline">
									{days}
									<br />
								</span>
								{opens} – {closes}
							</dd>
						</div>
						<div class={factRow}>
							<dt class={factLabel}>{t("app.contact.bookings@@Bookings")}</dt>
							<dd class="text-right lg:text-left lg:leading-normal">
								{t("app.contact.appointment_only@@By appointment only")}
							</dd>
						</div>
						{parking.length > 0 ? (
							<div class={factRow}>
								<dt class={factLabel}>
									{t("app.contact.parking_label@@Parking")}
								</dt>
								<dd class="flex flex-wrap justify-end gap-x-2 text-right lg:flex-col lg:justify-start lg:text-left lg:leading-normal">
									{parking.map((spot) => (
										<a
											key={spot.link}
											href={spot.link}
											target="_blank"
											rel="noopener noreferrer"
											class="link link-hover"
											onClick$={() =>
												trackGoogleAnalyticsEvent("parking_clicked", {
													placement: "contact_section",
													parking_name: spot.name,
													link_url: spot.link,
												})
											}
										>
											{spot.name}
										</a>
									))}
								</dd>
							</div>
						) : null}
					</dl>
				</FadeUp>

				<FadeUp delay={160} class="lg:mt-auto">
					<div class="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:gap-3">
						<Booking
							id="contact-book-btn"
							text={t("app.book.book_app@@Book Appointment")}
							analyticsPlacement="contact_section"
							classes="btn btn-neutral hidden h-14 min-h-14 px-6 font-main text-[0.9375rem] font-semibold lg:inline-flex"
						/>
						<a
							href={directionsUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick$={() =>
								trackGoogleAnalyticsEvent("directions_clicked", {
									placement: "contact_section",
									link_url: directionsUrl,
								})
							}
							class={[
								outlineAction,
								"col-span-2 justify-between lg:justify-center",
							]}
						>
							{t("app.contact.get_directions@@Get directions")}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								class="size-4.5 lg:hidden"
								aria-hidden="true"
							>
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</a>
						<a
							href={SITE_METADATA.socials.instagramMessage}
							target="_blank"
							rel="noopener noreferrer"
							onClick$={() =>
								trackGoogleAnalyticsEvent("instagram_clicked", {
									placement: "contact_section",
									target_type: "message",
									link_url: SITE_METADATA.socials.instagramMessage,
								})
							}
							class={outlineAction}
						>
							<span class="lg:hidden">Instagram</span>
							<span class="hidden lg:inline">
								{t("app.contact.message_instagram@@Message on Instagram")}
							</span>
						</a>
						<a
							href={`mailto:${email}`}
							onClick$={() =>
								trackGoogleAnalyticsEvent("contact_email_clicked", {
									placement: "contact_section",
									contact_method: "email",
								})
							}
							class={outlineAction}
						>
							<span class="lg:hidden">{t("app.contact.email@@Email")}</span>
							<span class="hidden lg:inline">
								{t("app.contact.email_us@@Email us")}
							</span>
						</a>
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
