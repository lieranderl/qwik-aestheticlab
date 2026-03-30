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
import { formatPrice } from "~/consts";
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
}

function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
	);
}

interface DisplayServiceGroup extends GroupedServiceData {
	displayTitle: string;
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

function getCategoryStartingPrice(groupServices: Service[]) {
	if (groupServices.length === 0) return undefined;
	return `${formatPrice(groupServices[0].price)}+`;
}

export const ServiceGrid = component$<ServiceGridProps>(
	({ services, serviceCategories, location }) => {
		const t = inlineTranslate();
		const showFullList = useSignal(false);
		const selectedCategoryId = useSignal<string | null>(null);
		const selectedLaserSubgroupId = useSignal<string | null>(null);
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
		const categoryById = new Map(
			serviceCategories.map((category) => [String(category.id), category]),
		);

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
			const currentPath = `${window.location.pathname}${window.location.search}`;
			history.replaceState(null, "", `${currentPath}#services`);
		});

		const openCategory = $((groupId: string) => {
			selectedCategoryId.value = groupId;
			selectedLaserSubgroupId.value = null;
			showFullList.value = true;

			const currentPath = `${window.location.pathname}${window.location.search}`;
			history.replaceState(null, "", currentPath);

			const servicesSection = document.getElementById("services");
			if (servicesSection) {
				servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});

		const openLaserSubgroup = $((groupId: string) => {
			selectedLaserSubgroupId.value = groupId;

			const servicesSection = document.getElementById("services");
			if (servicesSection) {
				servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});

		const resetLaserSubgroup = $(() => {
			selectedLaserSubgroupId.value = null;
		});

		useOnWindow(
			"hashchange",
			$(() => {
				if (window.location.hash === "#services") {
					showFullList.value = false;
					selectedCategoryId.value = null;
					selectedLaserSubgroupId.value = null;
				}
			}),
		);

		useTask$(() => {
			if (
				typeof window !== "undefined" &&
				window.location.hash === "#services"
			) {
				showFullList.value = false;
				selectedCategoryId.value = null;
				selectedLaserSubgroupId.value = null;
			}
		});

		return (
			<section id="services" class="bg-base-200 py-24">
				<div class="custom-container">
					<div class="mb-16 text-center">
						<FadeUp>
							<h2 class="font-qestero mb-4 text-4xl text-base-content md:text-5xl">
								{titleLabel}
							</h2>
							<div class="mx-auto h-px w-20 bg-primary" />
							<p class="font-montserrat mt-6 mx-auto max-w-lg text-base-content">
								{subtitleLabel}
							</p>
						</FadeUp>

						<FadeUp delay={200}>
							<div class="mt-8 flex flex-col items-center justify-center gap-3">
								<a
									href="pricelist"
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
						<div class="animate-fade-in space-y-8">
							{activeDetailGroup.value ? (
								<FadeUp>
									<div class="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
										<div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
											<div class="space-y-4">
												<div class="flex flex-wrap gap-2">
													<span class="badge badge-primary badge-outline rounded-full font-montserrat">
														{activeDetailGroup.value.groupServices.length}{" "}
														{treatmentsLabel}
													</span>
													{getCategoryStartingPrice(
														activeDetailGroup.value.groupServices,
													) ? (
														<span class="badge badge-outline rounded-full border-base-300 font-montserrat">
															{getCategoryStartingPrice(
																activeDetailGroup.value.groupServices,
															)}
														</span>
													) : null}
												</div>
												<div>
													<h3 class="font-qestero text-3xl text-base-content md:text-4xl">
														{getDisplayCategoryName(
															activeDetailGroup.value,
															defaultCategoryLabel,
														)}
													</h3>
													<p class="font-montserrat mt-3 max-w-2xl text-sm leading-relaxed text-base-content/75 md:text-base">
														{getCategoryDescription(
															activeDetailGroup.value.category,
															categoryDescriptionLabels,
														)}
													</p>
												</div>
											</div>
										</div>

										<div
											class="mt-6 overflow-x-auto pb-1"
											role="toolbar"
											aria-label={servicesAriaLabel}
										>
											<div class="flex w-max gap-2">
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
																openCategory(group.groupId);
															})}
															class={[
																"btn btn-sm shrink-0 rounded-full px-4 font-montserrat uppercase tracking-wider whitespace-nowrap",
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
										</div>
									</div>
								</FadeUp>
							) : null}

							{selectedGroup.value?.groupId === "laser" &&
							!selectedLaserSubgroup.value ? (
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
												price={getCategoryStartingPrice(group.groupServices)}
												supportingText={`${group.groupServices.length} ${treatmentsLabel}`}
												customAction$={$(() => {
													openLaserSubgroup(group.groupId);
												})}
												buttonLabel={viewTreatmentsLabel}
												delay={index * 120}
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
											<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
												{renderGroup.groupServices.map((service, index) => {
													const serviceCategory =
														categoryById.get(String(service.group_id)) ||
														renderGroup.category;
													return (
														<ServiceCard
															key={service.id}
															variant="service"
															title={toTitleCase(service.name)}
															description={service.description}
															price={formatPrice(service.price)}
															duration={service.duration}
															image={getServiceItemImage(
																serviceCategory,
																index,
															)}
															delay={100 + index * 50}
															serviceId={service.id}
															location={location}
														/>
													);
												})}
											</div>
										</div>
									));
								})
							)}
						</div>
					) : (
						<div class="grid animate-fade-in grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
										price={getCategoryStartingPrice(group.groupServices)}
										supportingText={`${group.groupServices.length} ${treatmentsLabel}`}
										customAction$={$(() => {
											openCategory(group.groupId);
										})}
										buttonLabel={viewTreatmentsLabel}
										delay={index * 120}
										serviceId={`cat-${group.groupId}`}
										location={location}
										showBooking={false}
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
