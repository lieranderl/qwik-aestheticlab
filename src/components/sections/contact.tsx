import { component$ } from "@builder.io/qwik";
import { HiEnvelopeOutline, HiMapPinOutline } from "@qwikest/icons/heroicons";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import type { Contact } from "~/types";
import { FadeUp } from "../fade-up";
import { MapEmbed } from "../google-map";

export interface ContactSectionProps {
	contact: Contact | null;
}

export default component$(({ contact }: ContactSectionProps) => {
	const t = inlineTranslate();
	return (
		<section id="contact" class="py-20 bg-base-200">
			<div class="container mx-auto px-4 md:px-16">
				<div class="max-w-5xl mx-auto">
					<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
						{t("app.contact.visit_us@@Visit Us")}
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
						{/* Opening Hours */}
						<FadeUp>
							<div class="bg-base-100 rounded-xl p-6">
								<h3 class="text-2xl mb-6 font-semibold">
									{t("app.contact.opening_hours@@Opening Hours")}
								</h3>
								<ul class="space-y-3">
									<li>
										<span class="font-medium">
											{t("app.contact.monday@@{Monday}")} –{" "}
											{t("app.contact.saturday@@{Saturday}")}:
										</span>{" "}
										{contact?.open_hours.from} – {contact?.open_hours.to}
									</li>
									<li class="text-base-content/70">
										{t(
											"app.contact.appointment_only@@{Visits are by appointment only}",
										)}
									</li>
								</ul>
							</div>
						</FadeUp>

						{/* Contact Details */}
						<FadeUp>
							<div class="bg-base-100 rounded-xl p-6">
								<h3 class="text-2xl mb-6 font-semibold">
									{t("app.contact.contact@@Contact")}
								</h3>
								<ul class="space-y-4">
									<li class="flex items-center gap-3">
										<HiEnvelopeOutline class="w-5 h-5 text-primary" />
										<a
											href={`mailto:${contact?.email}`}
											class="link link-hover break-all"
										>
											{contact?.email}
										</a>
									</li>
									<li class="flex items-start gap-3">
										<HiMapPinOutline class="w-5 h-5 text-primary mt-1" />
										<a
											href={contact?.location.link}
											target="_blank"
											rel="noreferrer"
											class="link link-hover"
										>
											<div>{contact?.location.address}</div>
											<div class="text-base-content/70">
												{contact?.location.name}
											</div>
										</a>
									</li>

									{contact?.parking?.length ? (
										<li class="flex items-start gap-3">
											<HiMapPinOutline class="w-5 h-5 text-primary mt-1" />
											<div>
												<div class="font-medium">
													{t("app.contact.parking@@Parking available at")}
												</div>
												<ul class="list-disc ml-5">
													{contact.parking.map((p) => (
														<li key={p.link}>
															<a
																href={p.link}
																target="_blank"
																rel="noreferrer"
																class="link link-hover"
															>
																{p.name}
															</a>
														</li>
													))}
												</ul>
											</div>
										</li>
									) : null}
								</ul>
							</div>
						</FadeUp>
					</div>

					{/* Map below details */}
					<FadeUp>
						<div class="mt-12" data-aos="fade-up">
							<MapEmbed />
						</div>
					</FadeUp>

					{/* Instagram CTA */}
					<div class="mt-12 flex justify-center">
						<a
							rel="noopener noreferrer"
							target="_blank"
							href="https://www.instagram.com/aestheticlabbe/"
							class="link inline-flex items-center gap-2 text-lg font-inter hover:text-base-content/70 transition-colors"
						>
							<SiInstagram class="w-6 h-6" />
							{t("app.contact.instagram@@Follow us on Instagram")}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
});
