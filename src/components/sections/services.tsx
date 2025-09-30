import { component$ } from "@builder.io/qwik";
import { HiClockOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { formatPrice } from "~/consts";
import type { Service, ServiceGroup } from "~/types";
// import { Booking } from "../booking-modal";
import { FadeUp } from "../fade-up";

export interface ServicesSectionProps {
	services: Service[];
	serviceCategories: ServiceGroup[];
}

export const ServicesSection = component$(
	({ services, serviceCategories }: ServicesSectionProps) => {
		const t = inlineTranslate();

		return (
			<section id="services" class="py-20 bg-base-200">
				<div class="custom-container">
					<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
						{t("app.services.title@@Our Services")}
					</h2>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4  md:gap-8">
						{Object.entries(
							services.reduce(
								(groups, service) => {
									const key = service.group_id; // ✅ group by group_id
									if (!groups[key]) groups[key] = [];
									groups[key].push(service);
									return groups;
								},
								{} as Record<string, Service[]>,
							),
						)
							// Step 1: enrich with category (lookup by group_id)
							.map(([groupId, groupedServices]) => {
								const category = serviceCategories.find(
									(c) => String(c.id) === String(groupId),
								);
								return {
									groupId,
									groupedServices,
									category,
									priority: category?.priority ?? 0,
								};
							})
							// Step 2: sort by category priority
							.sort((a, b) => b.priority - a.priority)
							// Step 3: render
							.map(({ groupId, groupedServices, category }) => {
								const categoryName = category?.name ?? "Other";

								return (
									<div key={groupId}>
										<FadeUp>
											<h2 class="text-2xl font-bold my-4">
												{categoryName.charAt(0).toUpperCase() +
													categoryName.substring(1)}
											</h2>
										</FadeUp>

										<div class="flex flex-col gap-4">
											{groupedServices
												.sort((a, b) => a.price - b.price)
												.map((service: Service) => (
													<FadeUp key={`${groupId}_${service.id}`}>
														<div
															key={`${groupId}_${service.id}`}
															class="p-4 rounded-lg bg-base-100"
														>
															{/* Expandable description */}
															<div class="collapse collapse-arrow">
																<input type="checkbox" />
																<div class="collapse-title">
																	<div class="flex justify-between items-top mb-4">
																		<h3 class="text-lg lg:text-xl">
																			{service.name}
																		</h3>
																		<div class="ms-2 font-semibold">
																			{formatPrice(service.price)}
																		</div>
																	</div>
																</div>
																<div class="collapse-content text-sm">
																	{service.description}
																</div>
															</div>

															{/* Booking button + duration */}
															<div class="flex justify-between items-center">
																{/* <Booking
																	id={`modal_${groupId}_${service.id}`}
																	text={t("app.book.book_now@@Book Now")}
																	location="372146"
																	category={String(groupId)}
																	product={`${service.id}:SV`}
																	classes="btn btn-sm btn-primary btn-outline"
																/> */}

																<div class="flex justify-end items-center">
																	<HiClockOutline class="mr-1" />
																	<div class="font-normal italic font-inter text-sm">
																		{service.duration}{" "}
																		{t("app.services.minutes@@minutes")}
																	</div>
																</div>
															</div>
														</div>
													</FadeUp>
												))}
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</section>
		);
	},
);
