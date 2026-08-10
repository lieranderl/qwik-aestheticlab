import {
	$,
	component$,
	useComputed$,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { ServiceCard } from "~/components/ui/service-card";
import { formatPrice } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import {
	type GroupedServiceData,
	getCategoryDescription,
	getCategoryStartingPrice,
	getServiceItemImage,
	groupServicesAndCategories,
	isLaserCategory,
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

const serviceDetailsCardId = "service-details-card";
const serviceDetailsHeadingId = "service-details-heading";

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

function revealServiceDetails() {
	const reducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	function tryScroll() {
		const card = document.getElementById(serviceDetailsCardId);
		if (card) {
			card.scrollIntoView({
				behavior: reducedMotion ? "auto" : "smooth",
				block: "start",
			});
			document
				.getElementById(serviceDetailsHeadingId)
				?.focus({ preventScroll: true });
		} else {
			requestAnimationFrame(tryScroll);
		}
	}

	requestAnimationFrame(tryScroll);
}

function getDisplayCategoryNameForGroup(
	group: DisplayServiceGroup,
	fallback: string,
) {
	const categoryName = group.displayTitle || group.category?.name || fallback;
	return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
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
		const titleLabel = t(
			"app.services.editorial_title@@Expert care, natural results",
		);
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
				revealServiceDetails();
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
				revealServiceDetails();
			},
		);

		const resetLaserSubgroup = $(() => {
			selectedLaserSubgroupId.value = null;
			updateTreatmentUrl("laser");
			revealServiceDetails();
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
			<section
				id="services"
				class="scroll-mt-24 bg-base-200 py-16 md:py-24 lg:py-28"
			>
				<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="mb-9 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
						<div>
							<p class="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
								{t("app.services.catalogue@@Our treatments")}
							</p>
							<h2 class="max-w-2xl text-balance font-cormorant text-4xl leading-[0.9] text-base-content sm:text-5xl md:text-7xl">
								{titleLabel}
							</h2>
						</div>

						<div class="max-w-md border-l border-base-300 pl-5 lg:justify-self-end">
							<p class="text-pretty font-montserrat text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
								{subtitleLabel}
							</p>
							<div class="mt-5">
								<a
									href="pricelist"
									onClick$={$(() => {
										trackGoogleAnalyticsEvent("pricing_link_clicked", {
											placement: "services_cta",
										});
									})}
									class="btn btn-sm min-h-11 border-base-content/25 font-montserrat text-xs font-semibold uppercase tracking-wider"
								>
									{viewFullLabel}
								</a>
							</div>
						</div>
					</div>

					{showFullList.value ? (
						<div class="space-y-6 md:space-y-8">
							{activeDetailGroup.value ? (
								<section
									id={serviceDetailsCardId}
									data-testid={serviceDetailsCardId}
									aria-labelledby={serviceDetailsHeadingId}
									class="card card-border scroll-mt-24 bg-base-100 p-4 shadow-sm md:p-6"
								>
									<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
										<div class="space-y-3 md:space-y-4">
											<div class="flex flex-wrap gap-2">
												<span class="badge badge-secondary badge-outline rounded-full font-montserrat">
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
													id={serviceDetailsHeadingId}
													tabIndex={-1}
													class="text-balance font-cormorant text-3xl leading-none text-base-content md:text-4xl"
												>
													{getDisplayCategoryNameForGroup(
														activeDetailGroup.value,
														defaultCategoryLabel,
													)}
												</h3>
												<p class="mt-2 max-w-2xl text-pretty font-montserrat text-[0.9375rem] leading-relaxed text-base-content/80 md:mt-3 md:text-base">
													{getCategoryDescription(
														activeDetailGroup.value.category,
														categoryDescriptionLabels,
													)}
												</p>
											</div>
										</div>
									</div>

									<nav
										class="mt-5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-6"
										aria-label={servicesAriaLabel}
									>
										<div class="flex w-max gap-2 px-3 md:px-0">
											{displayGroups.value.map((group) => {
												const displayCategoryName =
													getDisplayCategoryNameForGroup(
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
																: "btn-outline",
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
								</section>
							) : null}

							<div
								data-testid="service-back-actions"
								class="flex flex-wrap items-center justify-center gap-2 md:justify-end"
							>
								{selectedLaserSubgroupId.value ? (
									<button
										type="button"
										onClick$={resetLaserSubgroup}
										class="btn btn-ghost btn-sm rounded-full font-montserrat uppercase tracking-wider text-secondary"
									>
										{backToLaserLabel}
									</button>
								) : null}
								<button
									type="button"
									onClick$={resetOverview}
									class="btn btn-ghost btn-sm rounded-full font-montserrat uppercase tracking-wider text-secondary"
								>
									{backLabel}
								</button>
							</div>

							{selectedGroup.value?.groupId === "laser" &&
							!selectedLaserSubgroup.value ? (
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
									{laserSubgroups.value.map((group, _index) => {
										const displayCategoryName = getDisplayCategoryNameForGroup(
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
						<div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12 lg:gap-6">
							{displayGroups.value.map((group, index) => {
								const displayCategoryName = getDisplayCategoryNameForGroup(
									group,
									defaultCategoryLabel,
								);
								const description = getCategoryDescription(
									group.category,
									categoryDescriptionLabels,
								);

								return (
									<div
										key={group.groupId}
										class={
											index % 4 === 0 || index % 4 === 3
												? "lg:col-span-7"
												: "lg:col-span-5"
										}
									>
										<ServiceCard
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
											serviceId={`cat-${group.groupId}`}
											location={location}
											showBooking={false}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</section>
		);
	},
);
