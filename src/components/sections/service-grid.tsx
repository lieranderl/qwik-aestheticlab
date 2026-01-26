import {
	$,
	component$,
	useComputed$,
	useOnWindow,
	useSignal,
	useTask$,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { ServiceCard } from "~/components/ui/service-card";
import {
	getServiceItemImage,
	groupServicesAndCategories,
	resolveCoverImage,
} from "~/shared/service-utils";
import type { Service, ServiceGroup } from "~/types";

interface ServiceGridProps {
	services: Service[];
	serviceCategories: ServiceGroup[];
	location: string;
}

export const ServiceGrid = component$<ServiceGridProps>(
	({ services, serviceCategories, location }) => {
		const t = inlineTranslate();
		const showFullList = useSignal(false);
		const selectedCategoryId = useSignal<string | null>(null);

		const toTitleCase = (str: string) => {
			return str.replace(
				/\w\S*/g,
				(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
			);
		};

		// Memoize the grouping calculation
		const groupedServices = useComputed$(() => {
			return groupServicesAndCategories(services, serviceCategories);
		});

		// Reset view when navigating to #services anchor
		useOnWindow(
			"hashchange",
			$(() => {
				if (window.location.hash === "#services") {
					showFullList.value = false;
					selectedCategoryId.value = null;
				}
			}),
		);

		// Initial check on mount
		// eslint-disable-next-line qwik/no-use-visible-task
		useTask$(() => {
			if (typeof window !== "undefined") {
				if (window.location.hash === "#services") {
					showFullList.value = false;
					selectedCategoryId.value = null;
				}
			}
		});

		return (
			<section id="services" class="bg-base-200 py-24">
				<div class="custom-container">
					<div class="mb-16 text-center">
						<FadeUp>
							<h2 class="font-qestero mb-4 text-4xl text-base-content md:text-5xl">
								{t("app.services.title@@Our Services")}
							</h2>
							<div class="h-px w-20 bg-primary mx-auto" />
							<p class="font-montserrat mt-6 max-w-lg mx-auto text-base-content">
								{t(
									"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
								)}
							</p>
						</FadeUp>

						{/* Toggle Button */}
						<FadeUp delay={200}>
							<div class="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
								{showFullList.value ? (
									<button
										type="button"
										onClick$={() => {
											showFullList.value = false;
											selectedCategoryId.value = null;
											// Restore #services hash purely for consistency, or leave empty
											history.replaceState(null, "", "#services");
										}}
										class="group flex items-center gap-2 font-montserrat text-sm font-medium uppercase tracking-widest text-primary transition-colors hover:text-secondary"
									>
										{t("app.services.back@@Back to Overview")}
										<span class="transition-transform duration-300 rotate-180">
											→
										</span>
									</button>
								) : (
									<a
										href="pricelist"
										class="group flex items-center gap-2 font-montserrat text-sm font-medium uppercase tracking-widest text-primary transition-colors hover:text-secondary"
									>
										{t("app.services.view_full@@View full price list")}
										<span class="transition-transform duration-300 group-hover:translate-x-1">
											→
										</span>
									</a>
								)}
							</div>
						</FadeUp>
					</div>

					{/* MODE 1: Detail List (Filtered or Full) */}
					{showFullList.value ? (
						<div class="flex flex-col gap-12 md:gap-20 animate-fade-in">
							{groupedServices.value
								.filter((g) =>
									selectedCategoryId.value
										? g.groupId === selectedCategoryId.value
										: true,
								)
								.map((group) => {
									const {
										groupId,
										groupServices,
										category,
										displayTitleDefault,
									} = group;

									// Resolve Title
									let displayCategoryName =
										category?.name ||
										t("app.services.default_category@@Services");

									// Override for special keys
									if (displayTitleDefault) {
										// Simple translation lookup using the key provided by config
										displayCategoryName = t(`${displayTitleDefault}`);
									} else {
										// Capitalize default name
										displayCategoryName =
											displayCategoryName.charAt(0).toUpperCase() +
											displayCategoryName.slice(1);
									}

									return (
										<div key={groupId}>
											<FadeUp>
												<h3 class="font-qestero mb-8 text-3xl text-base-content">
													{displayCategoryName}
												</h3>
											</FadeUp>

											<div class="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
												{groupServices.map((service, index) => {
													return (
														<ServiceCard
															key={service.id}
															title={toTitleCase(service.name)}
															description={service.description}
															price={`€${service.price}`}
															duration={service.duration}
															image={getServiceItemImage(
																service,
																category,
																index,
															)} // Pass service, category, and index
															delay={100 + index * 50}
															serviceId={service.id}
															location={location}
														/>
													);
												})}
											</div>
										</div>
									);
								})}
						</div>
					) : (
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
							{groupedServices.value.map((group, index) => {
								const {
									groupId,
									category,
									displayDescriptionDefault,
									coverImageName,
								} = group;

								// Resolve Title
								const categoryName =
									category?.name ||
									t("app.services.default_category@@Services");

								const displayCategoryName =
									categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

								// Use Theme Display Info for description or fallback
								const description = displayDescriptionDefault
									? t(`${displayDescriptionDefault}`)
									: t(
											"app.services.general_desc@@Professional beauty treatments for your refined look.",
										);

								return (
									<ServiceCard
										key={groupId}
										title={displayCategoryName}
										description={description}
										image={resolveCoverImage(coverImageName)}
										customAction$={() => {
											selectedCategoryId.value = groupId;
											showFullList.value = true;
											// Clear hash so that clicking #services nav link later triggers a change event
											history.replaceState(null, "", " ");

											// Scroll to top of services section
											const servicesSection =
												document.getElementById("services");
											if (servicesSection) {
												servicesSection.scrollIntoView({ behavior: "smooth" });
											}
										}}
										buttonLabel={t(
											"app.services.view_treatments@@View Treatments",
										)}
										delay={index * 150}
										serviceId={`cat-${groupId}`}
										location={location}
									/>
								);
							})}
						</div>
					)}
				</div>
			</section>
		);
	},
);
