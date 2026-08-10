import {
	$,
	component$,
	useComputed$,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SectionWrapper } from "~/components/ui/section-wrapper";
import { ServiceCard } from "~/components/ui/service-card";
import { formatPrice } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import {
	type GroupedServiceData,
	getCategoryDescription,
	getCategoryStartingPrice,
	getDisplayCategoryName,
	getServiceItemImage,
	groupServicesAndCategories,
	isLaserCategory,
	resolveCoverImage,
} from "~/shared/service-utils";
import type { Service, ServiceGroup } from "~/types";

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Constants ────────────────────────────────────────────────────────────────

const serviceDetailsCardId = "service-details-card";
const serviceDetailsHeadingId = "service-details-heading";

// ── Helpers ──────────────────────────────────────────────────────────────────

function updateTreatmentUrl(categoryId?: string, subgroupId?: string) {
	const url = new URL(window.location.href);
	if (categoryId) url.searchParams.set("treatment", categoryId);
	else url.searchParams.delete("treatment");
	if (subgroupId) url.searchParams.set("treatmentArea", subgroupId);
	else url.searchParams.delete("treatmentArea");
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

// ── Sub-components ───────────────────────────────────────────────────────────

interface OverviewGridProps {
	displayGroups: DisplayServiceGroup[];
	treatmentsLabel: string;
	viewTreatmentsLabel: string;
	defaultCategoryLabel: string;
	fromPriceLabel: string;
	categoryDescriptionLabels: {
		manicure: string;
		pedicure: string;
		brows: string;
		laser: string;
		general: string;
	};
	onCategoryOpen: (
		groupId: string,
		categoryName: string,
		serviceCount: number,
	) => void;
}

const OverviewGrid = component$<OverviewGridProps>(
	({
		displayGroups,
		treatmentsLabel,
		viewTreatmentsLabel,
		defaultCategoryLabel,
		fromPriceLabel,
		categoryDescriptionLabels,
		onCategoryOpen,
	}) => {
		return (
			<div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12 lg:gap-6">
				{displayGroups.map((group, index) => {
					const displayCategoryName =
						getDisplayCategoryName(group.category, defaultCategoryLabel) ||
						group.displayTitle ||
						defaultCategoryLabel;
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
									onCategoryOpen(
										group.groupId,
										displayCategoryName,
										group.groupServices.length,
									);
								})}
								buttonLabel={viewTreatmentsLabel}
								serviceId={`cat-${group.groupId}`}
								showBooking={false}
							/>
						</div>
					);
				})}
			</div>
		);
	},
);

interface DetailViewProps {
	displayGroups: DisplayServiceGroup[];
	laserSubgroups: DisplayServiceGroup[];
	selectedCategoryId: string | null;
	selectedLaserSubgroupId: string | null;
	treatmentsLabel: string;
	fromPriceLabel: string;
	defaultCategoryLabel: string;
	laserCategoryLabel: string;
	viewTreatmentsLabel: string;
	categoryDescriptionLabels: {
		manicure: string;
		pedicure: string;
		brows: string;
		laser: string;
		general: string;
	};
	servicesAriaLabel: string;
	backLabel: string;
	backToLaserLabel: string;
	onCategoryOpen: (
		groupId: string,
		categoryName: string,
		serviceCount: number,
	) => void;
	onLaserSubgroupOpen: (
		groupId: string,
		categoryName: string,
		serviceCount: number,
	) => void;
	onResetLaserSubgroup: () => void;
	onResetOverview: () => void;
	categoryById: Map<string, ServiceGroup>;
	location: string;
}

const DetailView = component$<DetailViewProps>(
	({
		displayGroups,
		laserSubgroups,
		selectedCategoryId,
		selectedLaserSubgroupId,
		treatmentsLabel,
		fromPriceLabel,
		defaultCategoryLabel,
		laserCategoryLabel,
		viewTreatmentsLabel,
		categoryDescriptionLabels,
		servicesAriaLabel,
		backLabel,
		backToLaserLabel,
		onCategoryOpen,
		onLaserSubgroupOpen,
		onResetLaserSubgroup,
		onResetOverview,
		categoryById,
		location,
	}) => {
		const selectedGroup = displayGroups.find(
			(g) => g.groupId === selectedCategoryId,
		);
		const selectedLaserSubgroup = laserSubgroups.find(
			(g) => g.groupId === selectedLaserSubgroupId,
		);
		const activeDetailGroup =
			selectedGroup?.groupId === "laser" && selectedLaserSubgroup
				? selectedLaserSubgroup
				: selectedGroup;

		return (
			<div class="space-y-6 md:space-y-8">
				{activeDetailGroup ? (
					<section
						id={serviceDetailsCardId}
						data-testid={serviceDetailsCardId}
						aria-labelledby={serviceDetailsHeadingId}
						class="card card-border scroll-mt-24 bg-base-100 p-4 shadow-sm md:p-6"
					>
						<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
							<div class="space-y-3 md:space-y-4">
								<div class="flex flex-wrap gap-2">
									<span class="badge badge-secondary badge-outline rounded-full font-main">
										{activeDetailGroup.groupServices.length} {treatmentsLabel}
									</span>
									{getCategoryStartingPrice(
										activeDetailGroup.groupServices,
										fromPriceLabel,
									) ? (
										<span class="badge badge-outline rounded-full border-base-300 font-main">
											{getCategoryStartingPrice(
												activeDetailGroup.groupServices,
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
										{getDisplayCategoryName(
											activeDetailGroup.category,
											activeDetailGroup.displayTitle || defaultCategoryLabel,
										)}
									</h3>
									<p class="mt-2 max-w-2xl text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:mt-3 md:text-base">
										{getCategoryDescription(
											activeDetailGroup.category,
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
								{displayGroups.map((group) => {
									const categoryName =
										getDisplayCategoryName(
											group.category,
											defaultCategoryLabel,
										) ||
										group.displayTitle ||
										defaultCategoryLabel;

									return (
										<button
											key={group.groupId}
											type="button"
											onClick$={$(() => {
												onCategoryOpen(
													group.groupId,
													categoryName,
													group.groupServices.length,
												);
											})}
											class={[
												"btn btn-sm min-h-11 shrink-0 rounded-full px-4 font-main uppercase tracking-wider whitespace-nowrap",
												group.groupId === selectedCategoryId
													? "btn-primary"
													: "btn-outline",
											]}
											aria-pressed={group.groupId === selectedCategoryId}
										>
											{categoryName}
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
					{selectedLaserSubgroupId ? (
						<button
							type="button"
							onClick$={onResetLaserSubgroup}
							class="btn btn-ghost btn-sm rounded-full font-main uppercase tracking-wider text-secondary"
						>
							{backToLaserLabel}
						</button>
					) : null}
					<button
						type="button"
						onClick$={onResetOverview}
						class="btn btn-ghost btn-sm rounded-full font-main uppercase tracking-wider text-secondary"
					>
						{backLabel}
					</button>
				</div>

				{selectedGroup?.groupId === "laser" && !selectedLaserSubgroup ? (
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
						{laserSubgroups.map((group) => {
							const displayCategoryName =
								getDisplayCategoryName(group.category, laserCategoryLabel) ||
								group.displayTitle ||
								laserCategoryLabel;

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
										onLaserSubgroupOpen(
											group.groupId,
											displayCategoryName,
											group.groupServices.length,
										);
									})}
									buttonLabel={viewTreatmentsLabel}
									serviceId={`laser-${group.groupId}`}
									showBooking={false}
								/>
							);
						})}
					</div>
				) : (
					displayGroups
						.filter((group) =>
							selectedCategoryId ? group.groupId === selectedCategoryId : true,
						)
						.map((group) => {
							const groupsToRender =
								group.groupId === "laser" && selectedLaserSubgroup
									? [selectedLaserSubgroup]
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
													image={getServiceItemImage(serviceCategory, index)}
													serviceId={service.id}
													location={location}
													analyticsServiceCategory={
														serviceCategory?.name || renderGroup.displayTitle
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
		);
	},
);

// ── Main Component ───────────────────────────────────────────────────────────

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

		// ── Labels ──
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

		// ── Computed data ──
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

		// ── Actions ──
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

		useOnWindow("popstate", restoreTreatmentState);
		useOnWindow("hashchange", restoreTreatmentState);

		return (
			<SectionWrapper id="services">
				<div class="mb-9 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
					<div>
						<KickerLabel>
							{t("app.services.catalogue@@Our treatments")}
						</KickerLabel>
						<h2 class="max-w-2xl text-balance font-cormorant text-4xl leading-[0.9] text-base-content sm:text-5xl md:text-7xl">
							{titleLabel}
						</h2>
					</div>

					<div class="max-w-md border-l border-base-300 pl-5 lg:justify-self-end">
						<p class="text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
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
								class="btn btn-sm min-h-11 border-base-content/25 font-main text-xs font-semibold uppercase tracking-wider"
							>
								{viewFullLabel}
							</a>
						</div>
					</div>
				</div>

				{showFullList.value ? (
					<DetailView
						displayGroups={displayGroups.value}
						laserSubgroups={laserSubgroups.value}
						selectedCategoryId={selectedCategoryId.value}
						selectedLaserSubgroupId={selectedLaserSubgroupId.value}
						treatmentsLabel={treatmentsLabel}
						fromPriceLabel={fromPriceLabel}
						defaultCategoryLabel={defaultCategoryLabel}
						laserCategoryLabel={laserCategoryLabel}
						viewTreatmentsLabel={viewTreatmentsLabel}
						categoryDescriptionLabels={categoryDescriptionLabels}
						servicesAriaLabel={servicesAriaLabel}
						backLabel={backLabel}
						backToLaserLabel={backToLaserLabel}
						onCategoryOpen={openCategory}
						onLaserSubgroupOpen={openLaserSubgroup}
						onResetLaserSubgroup={resetLaserSubgroup}
						onResetOverview={resetOverview}
						categoryById={categoryById}
						location={location}
					/>
				) : displayGroups.value.length === 0 ? (
					<div class="alert border border-base-300 bg-base-100" role="status">
						<span>
							{t(
								"app.services.empty@@Treatments are temporarily unavailable. Please contact us for current options.",
							)}
						</span>
					</div>
				) : (
					<OverviewGrid
						displayGroups={displayGroups.value}
						treatmentsLabel={treatmentsLabel}
						viewTreatmentsLabel={viewTreatmentsLabel}
						defaultCategoryLabel={defaultCategoryLabel}
						fromPriceLabel={fromPriceLabel}
						categoryDescriptionLabels={categoryDescriptionLabels}
						onCategoryOpen={openCategory}
					/>
				)}
			</SectionWrapper>
		);
	},
);
