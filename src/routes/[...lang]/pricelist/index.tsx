import { $, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import ImgPricelistHero from "~/media/pricelist-hero.png?jsx";
import type { Service } from "~/types";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
} from "../layout";

export default component$(() => {
	const t = inlineTranslate();
	const services = useServicesLoader().value;
	const categories = useServiceGroupsLoader().value;
	const contact = useContactLoader().value;

	// Grouping Logic
	const groupedServices = Object.entries(
		services.reduce(
			(groups, service) => {
				const key = service.group_id;
				if (!groups[key]) groups[key] = [];
				groups[key].push(service);
				return groups;
			},
			{} as Record<string, Service[]>,
		),
	)
		.map(([groupId, groupServices]) => {
			const category = categories.find((c) => String(c.id) === String(groupId));
			return {
				groupId,
				groupServices,
				category,
				priority: category?.priority ?? 0,
			};
		})
		.sort((a, b) => b.priority - a.priority);
	return (
		<div class="min-h-screen">
			<Navigation />

			<main>
				{/* Simple Hero */}
				<div class="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
					<div class="absolute inset-0">
						<ImgPricelistHero
							alt="Services Background"
							class="h-full w-full object-cover brightness-90"
						/>
						<div class="absolute inset-0 bg-black/40" />
					</div>
					<div class="relative z-10 text-center p-6 text-white">
						<FadeUp>
							<h1 class="font-qestero text-4xl md:text-6xl mb-6">
								{t("app.services.pricing_title@@Services & Pricing")}
							</h1>
							<p class="font-montserrat text-lg max-w-xl mx-auto opacity-90">
								{t(
									"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
								)}
							</p>
						</FadeUp>
					</div>
				</div>

				{/* Pricing List */}
				<div class="custom-container py-24 max-w-6xl mx-auto">
					<div class="space-y-20">
						{groupedServices.map(
							({ groupId, category, groupServices }, index) => {
								const categoryName = category?.name || "Services";
								let displayCategoryName =
									categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

								if (displayCategoryName === "Brows") {
									displayCategoryName = "Brows & Lashes";
								}

								// Icon logic (simplified)
								let icon = "✨";
								if (displayCategoryName.toLowerCase().includes("manicure"))
									icon = "💅";
								if (displayCategoryName.toLowerCase().includes("pedicure"))
									icon = "🦶";
								if (displayCategoryName.toLowerCase().includes("brow"))
									icon = "👁️";
								if (displayCategoryName.toLowerCase().includes("laser"))
									icon = "⚡";

								return (
									<FadeUp key={groupId} delay={index * 100}>
										<div class="mb-8 flex items-center gap-4">
											<span class="text-xl md:text-2xl bg-base-100 p-3 rounded-full shadow-sm">
												{icon}
											</span>
											<h2 class="font-qestero text-2xl md:text-4xl text-base-content">
												{displayCategoryName}
											</h2>
										</div>

										<div class="bg-base-100 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
											{groupServices
												.sort((a, b) => a.price - b.price)
												.map((service) => {
													// eslint-disable-next-line react-hooks/rules-of-hooks
													const isExpanded = useSignal(false);

													return (
														<div key={service.id} class="group">
															{/* Header Row: Title --- Price */}
															<div class="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-1 md:gap-0">
																<div class="flex items-baseline grow min-w-0">
																	<h3 class="font-qestero text-lg md:text-2xl text-base-content pr-4">
																		{service.name.charAt(0).toUpperCase() +
																			service.name.slice(1)}
																	</h3>
																	{/* Dotted Leader - Visible only on Desktop/Tablet when row layout */}
																	<div class="hidden md:block grow border-b-2 border-dotted border-base-200 mx-2 relative top-[-6px] opacity-50 min-w-[20px]"></div>
																</div>
																<span class="font-montserrat text-base md:text-lg font-semibold shrink-0 md:pl-4 self-end md:self-auto">
																	€{service.price}
																</span>
															</div>

															{/* Description with expand/collapse on mobile */}
															<div class="mb-2">
																<p
																	class={`font-montserrat text-sm text-base-content/80 max-w-2xl ${isExpanded.value ? "" : "line-clamp-2 md:line-clamp-none"}`}
																>
																	{service.description}
																</p>
																{service.description &&
																	service.description.length > 100 && (
																		<button
																			type="button"
																			onClick$={$(() => {
																				isExpanded.value = !isExpanded.value;
																			})}
																			class="md:hidden text-xs text-primary font-medium mt-1 hover:underline"
																		>
																			{isExpanded.value
																				? "Read Less"
																				: "Read More"}
																		</button>
																	)}
															</div>

															{/* Meta: Duration */}
															{service.duration && (
																<div class="flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-wider">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="12"
																		height="12"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		stroke-width="2"
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		class="lucide lucide-clock"
																		aria-hidden="true"
																	>
																		<circle cx="12" cy="12" r="10" />
																		<polyline points="12 6 12 12 16 14" />
																	</svg>
																	{service.duration}{" "}
																	{t("app.services.minutes@@min")}
																</div>
															)}
														</div>
													);
												})}
										</div>
									</FadeUp>
								);
							},
						)}
					</div>
				</div>

				{/* CTO Bottom */}
				<section class="py-24 bg-base-100 text-center">
					<FadeUp>
						<h2 class="font-qestero text-4xl mb-6">
							{t("app.hero.book_visit@@Book Your Visit")}
						</h2>
						<Booking
							id="bottom_pricelist_book"
							text={t("app.hero.book_appointment@@Book Appointment")}
							location={contact?.location.name || ""}
							classes="btn btn-primary text-white rounded-full px-10 py-3 text-lg"
						/>
					</FadeUp>
				</section>
			</main>

			<Footer />
		</div>
	);
});

export const head: DocumentHead = {
	title: "Services & Pricing | Aesthetic Lab",
	meta: [
		{
			name: "description",
			content:
				"Full price list for manicures, pedicures, brows, and laser treatments.",
		},
	],
};
