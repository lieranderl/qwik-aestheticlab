import { component$ } from "@builder.io/qwik";
import { HiEnvelopeOutline, HiMapPinOutline } from "@qwikest/icons/heroicons";
import { SiInstagram } from "@qwikest/icons/simpleicons";
import { inlineTranslate } from "qwik-speak";
import type { Contact } from "~/types";

export interface ContactSectionProps {
	contact: Contact | null;
}

export default component$(({ contact }: ContactSectionProps) => {
	const t = inlineTranslate();
	return (
		<section id="contact" class="py-20 bg-base-300">
			<div class="container mx-auto px-4 md:px-16 ">
				<div class="max-w-4xl mx-auto">
					<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
						{t("app.contact.visit_us@@Visit Us")}
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<h3 class="text-2xl mb-6 font-semibold">
								{t("app.contact.opening_hours@@Opening Hours")}
							</h3>
							<ul class="space-y-2 list-disc pl-6">
								<li>
									{t("app.contact.monday@@{Monday}")} -{" "}
									{t("app.contact.saturday@@{Saturday}")}:{" "}
									{contact?.open_hours.from} - {contact?.open_hours.to}
								</li>
								<li>
									{t(
										"app.contact.appointment_only@@{Visits are by appointment only}",
									)}
								</li>
							</ul>
						</div>
						<div>
							<h3 class="text-2xl mb-6 font-semibold ">
								{t("app.contact.contact@@Contact")}
							</h3>
							<ul class="space-y-2 list-none pl-6">
								<li class="flex items-center gap-2">
									<HiEnvelopeOutline />
									<a
										href="mailto:aestheticlabbe@gmail.com"
										class="link link-hover"
									>
										{contact?.email}
									</a>
								</li>
								<li class="flex items-center gap-2">
									<HiMapPinOutline />
									<a
										href={contact?.location.link}
										target="_blank"
										class="link link-hover"
										rel="noreferrer"
									>
										<div>{contact?.location.address}</div>
										<div>{contact?.location.name}</div>
									</a>
								</li>
								{contact?.parking?.map((p) => (
									<li key={p.link} class="flex items-center gap-2">
										<HiMapPinOutline />
										<a
											href={p.link}
											target="_blank"
											class="link link-hover"
											rel="noreferrer"
										>
											<div>
												{t("app.contact.parking@@Parking available at")}
											</div>
											<div>{p.name}</div>
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Centered Instagram Section */}
					<div class="my-12 flex justify-center">
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
