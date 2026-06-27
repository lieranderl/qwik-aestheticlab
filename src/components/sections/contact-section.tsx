import { $, component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { MapEmbed } from "~/components/ui/google-map";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import type { Contact } from "~/types";

interface ContactSectionProps {
	contact: Contact | null;
}

export const ContactSection = component$<ContactSectionProps>(({ contact }) => {
	const t = inlineTranslate();

	if (!contact) return null;

	return (
		<section
			id="contact"
			class="relative overflow-hidden scroll-mt-24 bg-base-200 py-16 md:py-32"
		>
			<div class="custom-container relative z-10">
				<FadeUp class="mb-9 text-center md:mb-16">
					<h2 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
						{t("app.contact.visit_us@@Visit Us")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary" />
				</FadeUp>

				<FadeUp delay={200}>
					{/* Main Card Container */}
					<div class="card overflow-hidden rounded-2xl border border-white/50 bg-base-100/90 shadow-xl backdrop-blur-md lg:card-side lg:min-h-[600px]">
						<div class="card-body order-2 flex flex-col justify-start gap-6 p-5 md:gap-12 md:p-12 lg:order-1 lg:w-5/12">
							<div>
								<div class="flex flex-col gap-6 md:gap-8">
									{/* Location */}
									<div class="flex flex-col gap-1">
										<span class="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">
											{t("app.contact.location@@Location")}
										</span>
										<p class="font-montserrat text-lg font-medium leading-tight text-base-content md:text-xl">
											{contact.location.address}
										</p>
										<p class="text-base-content/70 text-sm mt-1">
											{contact.location.name}
										</p>
										<div class="card-actions mt-3 md:mt-4">
											<a
												href={contact.location.link}
												target="_blank"
												rel="noreferrer"
												onClick$={$(() => {
													trackGoogleAnalyticsEvent("directions_clicked", {
														placement: "contact_section",
														link_url: contact.location.link,
													});
												})}
												class="btn btn-primary btn-sm btn-outline"
											>
												{t("app.contact.directions@@Get Directions")}
											</a>
										</div>

										{/* Parking - Moved here */}
										{contact.parking && contact.parking.length > 0 && (
											<div class="mt-5 flex animate-fade-in flex-col gap-2 md:mt-6">
												<span class="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold opacity-80">
													{t("app.contact.parking@@Parking")}
												</span>
												<ul class="flex flex-wrap gap-x-4 gap-y-2">
													{contact.parking.map((p) => (
														<li key={p.link}>
															<a
																href={p.link}
																target="_blank"
																rel="noreferrer"
																onClick$={$(() => {
																	trackGoogleAnalyticsEvent("parking_clicked", {
																		placement: "contact_section",
																		parking_name: p.name,
																		link_url: p.link,
																	});
																})}
																class="flex items-center gap-2 group"
															>
																<span class="w-1.5 h-1.5 rounded-2xl bg-primary/40 group-hover:bg-primary transition-colors" />
																<span class="font-montserrat text-sm text-base-content/80 group-hover:text-primary transition-colors underline-offset-4 decoration-primary/30 group-hover:underline">
																	{p.name}
																</span>
															</a>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>

									<div class="divider my-0 opacity-50"></div>

									{/* Hours */}
									<div class="flex flex-col gap-1">
										<span class="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">
											{t("app.contact.opening_hours@@Hours")}
										</span>
										<div class="flex items-baseline gap-4">
											<span class="font-montserrat text-xl text-base-content md:text-2xl">
												{contact.open_hours.from}–{contact.open_hours.to}
											</span>
										</div>
										<p class="font-montserrat text-sm text-base-content/70 mt-1">
											{t("app.contact.monday@@Mon")} -{" "}
											{t("app.contact.saturday@@Sat")}
										</p>

										{/* Refined Appointment Badge */}
										<div class="mt-3 flex items-center gap-2 text-primary md:mt-4">
											<div class="w-2 h-2 rounded-2xl bg-primary animate-pulse" />
											<span class="font-montserrat text-xs font-semibold tracking-wide uppercase">
												{t("app.contact.appointment_only@@By appointment only")}
											</span>
										</div>
									</div>

									<div class="divider my-0 opacity-50"></div>

									{/* Contact */}
									<div class="flex flex-col gap-1">
										<span class="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">
											{t("app.contact.contact@@Contact")}
										</span>
										<a
											href={`mailto:${contact.email}`}
											onClick$={$(() => {
												trackGoogleAnalyticsEvent("contact_email_clicked", {
													placement: "contact_section",
													contact_method: "email",
												});
											})}
											class="w-fit border-b border-base-200 pb-0.5 font-montserrat text-base text-base-content transition-colors hover:border-primary hover:text-primary md:text-lg"
										>
											{contact.email}
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Right Map Panel */}
						<figure
							class="relative order-1 h-[220px] bg-neutral-100 md:h-[300px] lg:order-2 lg:h-auto lg:min-h-[450px] lg:w-7/12"
							aria-label={t("app.contact.map_location@@Location map")}
						>
							<div class="absolute inset-0 w-full h-full lg:grayscale lg:hover:grayscale-0 transition-[filter] duration-1000">
								<MapEmbed />
							</div>
							{/* Mobile Overlay Gradient */}
							<div class="absolute inset-0 bg-linear-to-b from-transparent to-white/10 lg:hidden pointer-events-none" />
						</figure>
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
