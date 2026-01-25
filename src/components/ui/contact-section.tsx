import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { MapEmbed } from "~/components/ui/google-map";
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
			class="bg-base-200 py-32 relative overflow-hidden scroll-mt-24"
		>
			{/* Background Decor */}
			<div class="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
				<div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
				<div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
			</div>

			<div class="custom-container relative z-10">
				<FadeUp class="text-center mb-16">
					<h2 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
						{t("app.contact.visit_us@@Visit Us")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary" />
				</FadeUp>

				<FadeUp delay={200}>
					{/* Main Card Container */}
					<div class="card lg:card-side bg-base-100 overflow-hidden min-h-[600px] border border-base-300/50">
						<div class="card-body p-6 md:p-12 lg:w-5/12 order-2 lg:order-1 flex flex-col justify-start gap-8 md:gap-12">
							<div>
								<div class="flex flex-col gap-8">
									{/* Location */}
									<div class="flex flex-col gap-1">
										<span class="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">
											{t("app.contact.location@@Location")}
										</span>
										<p class="font-montserrat text-xl text-base-content font-medium leading-tight">
											{contact.location.address}
										</p>
										<p class="text-neutral-content text-sm mt-1">
											{contact.location.name}
										</p>
										<div class="card-actions mt-4">
											<a
												href={contact.location.link}
												target="_blank"
												rel="noreferrer"
												class="btn btn-primary btn-sm rounded-full px-6 font-montserrat tracking-wide text-white border-none"
											>
												{t("app.contact.directions@@Get Directions")}
											</a>
										</div>

										{/* Parking - Moved here */}
										{contact.parking && contact.parking.length > 0 && (
											<div class="mt-6 flex flex-col gap-2 animate-fade-in">
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
																class="flex items-center gap-2 group"
															>
																<span class="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
																<span class="font-montserrat text-xs text-neutral-content group-hover:text-primary transition-colors underline-offset-4 decoration-primary/30 group-hover:underline">
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
											<span class="font-qestero text-3xl text-base-content">
												{contact.open_hours.from} — {contact.open_hours.to}
											</span>
										</div>
										<p class="font-montserrat text-sm text-neutral-content mt-1">
											{t("app.contact.monday@@Mon")} —{" "}
											{t("app.contact.saturday@@Sat")}
										</p>

										<div class="alert alert-info bg-primary/10 border-none shadow-xs text-primary text-xs py-2.5 px-4 rounded-lg flex items-center gap-3 mt-4 w-fit">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="w-4 h-4"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
												/>
											</svg>
											<span class="font-montserrat font-semibold italic">
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
											class="font-montserrat text-lg text-base-content hover:text-primary transition-colors w-fit border-b border-base-200 hover:border-primary pb-0.5"
										>
											{contact.email}
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Right Map Panel */}
						<figure
							class="lg:w-7/12 h-[300px] lg:h-auto lg:min-h-[450px] relative order-1 lg:order-2"
							aria-label={t("app.contact.map_location@@Location map")}
						>
							<div class="absolute inset-0 w-full h-full lg:grayscale lg:hover:grayscale-0 transition-all duration-1000">
								<MapEmbed />
							</div>
							{/* Mobile Overlay Gradient */}
							<div class="absolute inset-0 bg-linear-to-b from-transparent to-base-100/10 lg:hidden pointer-events-none" />
						</figure>
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
