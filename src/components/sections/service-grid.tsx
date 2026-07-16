import {
	$,
	component$,
	useComputed$,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { ServiceCard } from "~/components/ui/service-card";
import { formatPrice } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import {
	type GroupedServiceData,
	getServiceItemImage,
	groupServicesAndCategories,
	resolveCoverImage,
} from "~/shared/service-utils";
import type { Service, ServiceGroup } from "~/types";

interface ServiceGridProps {
	services: Service[];
	serviceCategories: ServiceGroup[];
	location: string;
	initialCategoryId?: string;
	initialSubgroupId?: string;
}

interface DisplayServiceGroup extends GroupedServiceData {
	displayTitle: string;
}

function updateTreatmentUrl(categoryId?: string, subgroupId?: string) {
	const url = new URL(window.location.href);

	if (categoryId) {
		url.searchParams.set("treatment", categoryId);
	} else {
		url.searchParams.delete("treatment");
	}

	if (subgroupId) {
		url.searchParams.set("treatmentArea", subgroupId);
	} else {
		url.searchParams.delete("treatmentArea");
	}

	url.hash = "services";
	history.pushState(null, "", url);
}

function focusServiceDetails() {
	requestAnimationFrame(() => {
		document.getElementById("service-details-heading")?.focus();
	});
}

function scrollToServices() {
	document.getElementById("services")?.scrollIntoView({
		behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
			? "auto"
			: "smooth",
		block: "start",
	});
}

function isLaserCategory(category: ServiceGroup | undefined) {
	const normalizedName = (
		category?.name_en ||
		category?.name ||
		""
	).toLowerCase();
	return normalizedName.includes("laser") || normalizedName.includes("removal");
}

function getDisplayCategoryName(group: DisplayServiceGroup, fallback: string) {
	const categoryName = group.displayTitle || group.category?.name || fallback;
	return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

function getCategoryDescription(
	category: ServiceGroup | undefined,
	labels: {
		manicure: string;
		pedicure: string;
		brows: string;
		laser: string;
		general: string;
	},
) {
	const normalizedName = (
		category?.name_en ||
		category?.name ||
		""
	).toLowerCase();

	if (normalizedName.includes("manicure")) {
		return labels.manicure;
	}

	if (normalizedName.includes("pedicure")) {
		return labels.pedicure;
	}

	if (normalizedName.includes("brows") || normalizedName.includes("lashes")) {
		return labels.brows;
	}

	if (normalizedName.includes("laser") || normalizedName.includes("removal")) {
		return labels.laser;
	}

	return labels.general;
}

function formatPremiumPrice(price: number) {
	const formattedPrice = formatPrice(price).replace(/\u00a0/g, " ");
	const amount = formattedPrice.replace(/\s*€$/, "");
	const englishAmount = amount.replace(/\./g, ",").replace(/,(\d{2})$/, ".$1");
	return `€${englishAmount}`;
}

function getCategoryStartingPrice(groupServices: Service[], fromLabel: string) {
	if (groupServices.length === 0) return undefined;
	const startingPrice = Math.min(
		...groupServices.map((service) => service.price),
	);
	return `${fromLabel} ${formatPremiumPrice(startingPrice)}`;
}

export const ServiceGrid = component$<ServiceGridProps>(
	({
		services,
		serviceCategories,
		location,
		initialCategoryId,
		initialSubgroupId,
	}) => {
		const t = inlineTranslate();
		const categoryById = new Map(
			serviceCategories.map((category) => [String(category.id), category]),
		);
		const hasInitialCategory = initialCategoryId
			? initialCategoryId === "laser"
				? services.some((service) =>
						isLaserCategory(categoryById.get(String(service.group_id))),
					)
				: services.some(
						(service) => String(service.group_id) === initialCategoryId,
					)
			: false;
		const hasInitialLaserSubgroup =
			hasInitialCategory &&
			initialCategoryId === "laser" &&
			Boolean(initialSubgroupId) &&
			services.some(
				(service) =>
					String(service.group_id) === initialSubgroupId &&
					isLaserCategory(categoryById.get(String(service.group_id))),
			);
		const showFullList = useSignal(hasInitialCategory);
		const selectedCategoryId = useSignal<string | null>(
			hasInitialCategory ? initialCategoryId || null : null,
		);
		const selectedLaserSubgroupId = useSignal<string | null>(
			hasInitialLaserSubgroup ? initialSubgroupId || null : null,
		);
		const defaultCategoryLabel = t("app.services.default_category@@Services");
		const treatmentsLabel = t("app.services.treatments@@Treatments");
		const servicesAriaLabel = t("app.nav.services@@Services");
		const viewFullLabel = t("app.services.view_full@@View full price list");
		const backLabel = t("app.services.back@@Back to Overview");
		const backToLaserLabel = t("app.services.back_laser@@Back to Laser");
		const titleLabel = t("app.services.title@@Our Services");
		const subtitleLabel = t(
			"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
		);
		const viewTreatmentsLabel = t(
			"app.services.view_treatments@@View Treatments",
		);
		const fromPriceLabel = t("app.services.from_price@@From");
		const laserCategoryLabel = t("app.services.laser_category@@Laser");
		const categoryDescriptionLabels = {
			manicure: t(
				"app.services.manicure_desc@@Expert gel artistry and precision Russian techniques for naturally flawless nails.",
			),
			pedicure: t(
				"app.services.pedicure_desc@@Professional therapeutic care and aesthetic refinement for healthy, radiant feet.",
			),
			brows: t(
				"app.services.brows_desc@@Shaping, tinting, and lamination for the perfect arch.",
			),
			laser: t(
				"app.services.laser_desc@@Safe, effective, and painless technology for smooth skin.",
			),
			general: t(
				"app.services.general_desc@@Professional beauty treatments for your refined look.",
			),
		};
		const groupedServices = useComputed$(() => {
			return groupServicesAndCategories(services, serviceCategories);
		});

		const laserSubgroups = useComputed$<DisplayServiceGroup[]>(() => {
			return groupedServices.value
				.filter((group) => isLaserCategory(group.category))
				.sort((a, b) => b.priority - a.priority)
				.map((group) => ({
					...group,
					displayTitle: group.category?.name || laserCategoryLabel,
				}));
		});

		const displayGroups = useComputed$<DisplayServiceGroup[]>(() => {
			const laserGroups = groupedServices.value.filter((group) =>
				isLaserCategory(group.category),
			);
			const standardGroups = groupedServices.value.filter(
				(group) => !isLaserCategory(group.category),
			);

			if (laserGroups.length === 0) {
				return groupedServices.value.map((group) => ({
					...group,
					displayTitle: group.category?.name || defaultCategoryLabel,
				}));
			}

			const mergedLaserGroup: DisplayServiceGroup = {
				...laserGroups[0],
				groupId: "laser",
				realGroupId: "laser",
				groupServices: laserGroups
					.flatMap((group) => group.groupServices)
					.sort((a, b) => a.price - b.price),
				priority: Math.max(...laserGroups.map((group) => group.priority)),
				displayTitle: laserCategoryLabel,
				coverImageName: "laser",
			};

			return [...standardGroups, mergedLaserGroup]
				.sort((a, b) => b.priority - a.priority)
				.map((group) => ({
					...group,
					displayTitle:
						"displayTitle" in group
							? (group as DisplayServiceGroup).displayTitle
							: group.category?.name || defaultCategoryLabel,
				}));
		});

		const filteredGroups = useComputed$(() => {
			return displayGroups.value.filter((group) =>
				selectedCategoryId.value
					? group.groupId === selectedCategoryId.value
					: true,
			);
		});

		const selectedGroup = useComputed$<DisplayServiceGroup | null>(() => {
			return (
				displayGroups.value.find(
					(group) => group.groupId === selectedCategoryId.value,
				) || null
			);
		});

		const selectedLaserSubgroup = useComputed$<DisplayServiceGroup | null>(
			() => {
				return (
					laserSubgroups.value.find(
						(group) => group.groupId === selectedLaserSubgroupId.value,
					) || null
				);
			},
		);

		const activeDetailGroup = useComputed$<DisplayServiceGroup | null>(() => {
			if (
				selectedGroup.value?.groupId === "laser" &&
				selectedLaserSubgroup.value
			) {
				return selectedLaserSubgroup.value;
			}

			return selectedGroup.value;
		});

		const resetOverview = $(() => {
			showFullList.value = false;
			selectedCategoryId.value = null;
			selectedLaserSubgroupId.value = null;
			updateTreatmentUrl();
		});

		const openCategory = $(
			(groupId: string, categoryName?: string, serviceCount?: number) => {
				selectedCategoryId.value = groupId;
				selectedLaserSubgroupId.value = null;
				showFullList.value = true;

				trackGoogleAnalyticsEvent("service_category_viewed", {
					category_id: groupId,
					service_category: categoryName,
					service_count: serviceCount,
					placement: "services_overview",
				});

				updateTreatmentUrl(groupId);
				scrollToServices();
				focusServiceDetails();
			},
		);

		const openLaserSubgroup = $(
			(groupId: string, categoryName?: string, serviceCount?: number) => {
				selectedLaserSubgroupId.value = groupId;

				trackGoogleAnalyticsEvent("service_category_viewed", {
					category_id: groupId,
					service_category: categoryName,
					service_count: serviceCount,
					placement: "laser_subgroup",
				});

				updateTreatmentUrl("laser", groupId);
				scrollToServices();
				focusServiceDetails();
			},
		);

		const resetLaserSubgroup = $(() => {
			selectedLaserSubgroupId.value = null;
			updateTreatmentUrl("laser");
			focusServiceDetails();
		});

		const restoreTreatmentState = $(() => {
			const url = new URL(window.location.href);
			const categoryId = url.searchParams.get("treatment");
			const subgroupId = url.searchParams.get("treatmentArea");
			const hasCategory = displayGroups.value.some(
				(group) => group.groupId === categoryId,
			);

			selectedCategoryId.value = hasCategory ? categoryId : null;
			selectedLaserSubgroupId.value =
				categoryId === "laser" &&
				laserSubgroups.value.some((group) => group.groupId === subgroupId)
					? subgroupId
					: null;
			showFullList.value = hasCategory;
		});

		// URL state keeps the drill-down shareable, restores Back/Forward, and
		// falls back to the overview when a query references an unknown category.
		useOnWindow("popstate", restoreTreatmentState);
		useOnWindow("hashchange", restoreTreatmentState);

		return (
			<section id="services" class="section-shell bg-base-200">
				<div class="custom-container">
					<div class="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
						<FadeUp class="text-center lg:text-left">
							<p class="editorial-kicker mb-4">
								{t("app.services.catalogue@@Treatment catalogue")}
							</p>
							<h2 class="section-heading mb-4 md:mb-5">{titleLabel}</h2>
							<div class="editorial-rule mx-auto w-20 lg:mx-0 lg:w-32" />
						</FadeUp>

						<FadeUp delay={60} class="lg:justify-self-end">
							<div class="mx-auto flex max-w-xl flex-col items-center gap-4 text-center md:gap-5 lg:mx-0 lg:items-end lg:text-right">
								<p class="section-lead">{subtitleLabel}</p>
								<a
									href="pricelist"
									onClick$={$(() => {
										trackGoogleAnalyticsEvent("pricing_link_clicked", {
											placement: "services_cta",
										});
									})}
									class="btn btn-outline btn-primary btn-sm rounded-full font-montserrat uppercase tracking-wider"
								>
									{viewFullLabel}
								</a>
								{selectedLaserSubgroupId.value ? (
									<button
										type="button"
										onClick$={resetLaserSubgroup}
										class="btn btn-ghost btn-sm rounded-full font-montserrat uppercase tracking-wider text-primary"
									>
										{backToLaserLabel}
									</button>
								) : null}
								{showFullList.value ? (
									<button
										type="button"
										onClick$={resetOverview}
										class="btn btn-ghost btn-sm rounded-full font-montserrat uppercase tracking-wider text-primary"
									>
										{backLabel}
									</button>
								) : null}
							</div>
						</FadeUp>
					</div>

					{showFullList.value ? (
						<div class="space-y-6 md:space-y-8">
							{activeDetailGroup.value ? (
								<FadeUp>
									<div class="surface-card p-4 md:p-6">
										<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
											<div class="space-y-3 md:space-y-4">
												<div class="flex flex-wrap gap-2">
													<span class="badge badge-primary badge-outline rounded-full font-montserrat">
														{activeDetailGroup.value.groupServices.length}{" "}
														{treatmentsLabel}
													</span>
													{getCategoryStartingPrice(
														activeDetailGroup.value.groupServices,
														fromPriceLabel,
													) ? (
														<span class="badge badge-outline rounded-full border-base-300 font-montserrat">
															{getCategoryStartingPrice(
																activeDetailGroup.value.groupServices,
																fromPriceLabel,
															)}
														</span>
													) : null}
												</div>
												<div>
													<h3
														id="service-details-heading"
														tabIndex={-1}
														class="text-balance font-qestero text-3xl leading-none text-base-content outline-none md:text-4xl"
													>
														{getDisplayCategoryName(
															activeDetailGroup.value,
															defaultCategoryLabel,
														)}
													</h3>
													<p class="section-lead mt-2 max-w-2xl md:mt-3">
														{getCategoryDescription(
															activeDetailGroup.value.category,
															categoryDescriptionLabels,
														)}
													</p>
												</div>
											</div>
										</div>

										<nav
											class="scrollbar-none mt-5 overflow-x-auto overscroll-x-contain pb-1 md:mt-6"
											aria-label={servicesAriaLabel}
										>
											<div class="flex w-max gap-2 px-3 md:px-0">
												{displayGroups.value.map((group) => {
													const displayCategoryName = getDisplayCategoryName(
														group,
														defaultCategoryLabel,
													);

													return (
														<button
															key={group.groupId}
															type="button"
															onClick$={$(() => {
																openCategory(
																	group.groupId,
																	displayCategoryName,
																	group.groupServices.length,
																);
															})}
															class={[
																"btn btn-sm min-h-11 shrink-0 rounded-full px-4 font-montserrat uppercase tracking-wider whitespace-nowrap",
																group.groupId === selectedCategoryId.value
																	? "btn-primary"
																	: "btn-outline btn-primary",
															]}
															aria-pressed={
																group.groupId === selectedCategoryId.value
															}
														>
															{displayCategoryName}
														</button>
													);
												})}
											</div>
										</nav>
									</div>
								</FadeUp>
							) : null}

							{selectedGroup.value?.groupId === "laser" &&
							!selectedLaserSubgroup.value ? (
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
									{laserSubgroups.value.map((group, index) => {
										const displayCategoryName = getDisplayCategoryName(
											group,
											laserCategoryLabel,
										);

										return (
											<ServiceCard
												key={group.groupId}
												variant="category"
												title={displayCategoryName}
												description={getCategoryDescription(
													group.category,
													categoryDescriptionLabels,
												)}
												image={resolveCoverImage(group.coverImageName)}
												price={getCategoryStartingPrice(
													group.groupServices,
													fromPriceLabel,
												)}
												supportingText={`${group.groupServices.length} ${treatmentsLabel}`}
												customAction$={$(() => {
													openLaserSubgroup(
														group.groupId,
														displayCategoryName,
														group.groupServices.length,
													);
												})}
												buttonLabel={viewTreatmentsLabel}
												delay={index * 60}
												serviceId={`laser-${group.groupId}`}
												location={location}
												showBooking={false}
											/>
										);
									})}
								</div>
							) : (
								filteredGroups.value.map((group) => {
									const groupsToRender =
										group.groupId === "laser" && selectedLaserSubgroup.value
											? [selectedLaserSubgroup.value]
											: [group];

									return groupsToRender.map((renderGroup) => (
										<div key={renderGroup.groupId} class="space-y-6">
											<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
												{renderGroup.groupServices.map((service, index) => {
													const serviceCategory =
														categoryById.get(String(service.group_id)) ||
														renderGroup.category;
													return (
														<ServiceCard
															key={service.id}
															variant="service"
															title={service.name}
															description={service.description}
															price={formatPrice(service.price)}
															duration={service.duration}
															image={getServiceItemImage(
																serviceCategory,
																index,
															)}
															delay={60 + Math.min(index, 4) * 40}
															serviceId={service.id}
															location={location}
															analyticsServiceCategory={
																serviceCategory?.name ||
																renderGroup.displayTitle
															}
														/>
													);
												})}
											</div>
										</div>
									));
								})
							)}
						</div>
					) : displayGroups.value.length === 0 ? (
						<div class="alert border border-base-300 bg-base-100" role="status">
							<span>
								{t(
									"app.services.empty@@Treatments are temporarily unavailable. Please contact us for current options.",
								)}
							</span>
						</div>
					) : (
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
							{displayGroups.value.map((group, index) => {
								const displayCategoryName = getDisplayCategoryName(
									group,
									defaultCategoryLabel,
								);
								const description = getCategoryDescription(
									group.category,
									categoryDescriptionLabels,
								);

								return (
									<ServiceCard
										key={group.groupId}
										variant="category"
										title={displayCategoryName}
										description={description}
										image={resolveCoverImage(group.coverImageName)}
										price={getCategoryStartingPrice(
											group.groupServices,
											fromPriceLabel,
										)}
										supportingText={`${group.groupServices.length} ${treatmentsLabel}`}
										customAction$={$(() => {
											openCategory(
												group.groupId,
												displayCategoryName,
												group.groupServices.length,
											);
										})}
										buttonLabel={viewTreatmentsLabel}
										delay={index * 60}
										serviceId={`cat-${group.groupId}`}
										location={location}
										showBooking={false}
										eager={index < 2}
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
