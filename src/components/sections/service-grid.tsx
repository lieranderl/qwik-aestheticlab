import {
	$,
	component$,
	type PropFunction,
	useComputed$,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { ExpandableText } from "~/components/ui/expandable-text";
import { FadeUp } from "~/components/ui/fade-up";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SectionWrapper } from "~/components/ui/section-wrapper";
import { SITE_METADATA } from "~/constants/metadata";
import { formatPrice } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { resolveImageComponent } from "~/shared/image-resolver";
import {
	buildDisplayGroups,
	buildLaserSubgroups,
	createCategoryIndex,
	type DisplayServiceGroup,
	resolveTreatmentSelection,
} from "~/shared/service-catalog";
import {
	capitalizeFirst,
	getCategoryDescription,
	getCategoryStartingPrice,
	getDisplayCategoryName,
	getLowestAddOnPrice,
	getMainServices,
	groupServicesAndCategories,
	isAddOnService,
	isLaserCategory,
	resolveCoverImage,
} from "~/shared/service-utils";
import { scrollToTarget } from "~/shared/smooth-scroll";
import type { Service, ServiceGroup } from "~/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface ServiceGridProps {
	services: Service[];
	serviceCategories: ServiceGroup[];
	location: string;
	initialCategoryId?: string;
	initialSubgroupId?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const serviceDetailsCardId = "service-details-card";
const serviceDetailsHeadingId = "service-details-heading";
const serviceCategoryNavId = "service-category-nav";

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

/** Back to the category overview: bring the Services section top into view. */
function revealServicesTop() {
	requestAnimationFrame(() => {
		const services = document.getElementById("services");
		if (services) scrollToTarget(services);
	});
}

function revealServiceDetails() {
	function tryScroll() {
		const card = document.getElementById(serviceDetailsCardId);
		if (card) {
			scrollToTarget(card);
			document
				.getElementById(serviceDetailsHeadingId)
				?.focus({ preventScroll: true });
			document
				.querySelector(`#${serviceCategoryNavId} [aria-pressed="true"]`)
				?.scrollIntoView({ block: "nearest", inline: "center" });
		} else {
			requestAnimationFrame(tryScroll);
		}
	}
	requestAnimationFrame(tryScroll);
}

// ── Sub-components ───────────────────────────────────────────────────────────

const ArrowIcon = component$(() => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.4"
		class="size-4.5"
		aria-hidden="true"
	>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</svg>
));

interface CategoryTileProps {
	index: number;
	title: string;
	description: string;
	price?: string;
	count: string;
	image: string;
	tileId: string;
	onOpen$: PropFunction<() => void>;
}

/**
 * One treatment category: a photo card with its starting price. Cards swipe
 * sideways on phones and form a grid from md up. On hover the card lifts and
 * the photo shifts inside its frame (it never zooms).
 */
const CategoryTile = component$<CategoryTileProps>(
	({ index, title, description, price, count, image, tileId, onOpen$ }) => {
		const ImageComp = resolveImageComponent(image);
		const descriptionId = `${tileId}-description`;
		return (
			<li class="w-[72vw] max-w-72 shrink-0 snap-start md:w-auto md:max-w-none">
				<button
					type="button"
					onClick$={onOpen$}
					aria-describedby={descriptionId}
					class="group flex h-full w-full flex-col gap-3.5 cursor-pointer text-left transition-[translate] duration-700 ease-(--ease-quint) hover:-translate-y-1.5 motion-reduce:transition-none"
				>
					<span class="relative block aspect-4/5 overflow-hidden bg-stone">
						{ImageComp ? (
							<ImageComp
								alt=""
								class="absolute inset-x-0 -top-3 h-[calc(100%+1.5rem)] w-full object-cover transition-transform duration-700 ease-(--ease-quint) group-hover:-translate-y-3 motion-reduce:transition-none"
								loading="eager"
								sizes="(min-width: 1280px) 15rem, (min-width: 768px) 30vw, 72vw"
							/>
						) : null}
						{price ? (
							<span class="absolute top-3.5 left-3.5 bg-blush px-3 py-1.5 font-main text-[0.8125rem] font-semibold text-ink">
								{price}
							</span>
						) : null}
					</span>
					<span class="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
						<span class="font-cormorant text-[2rem] leading-none text-ink md:text-[2.125rem]">
							{title}
						</span>
						<span class="font-main text-xs font-semibold tracking-[0.12em] text-rosewood">
							{String(index + 1).padStart(2, "0")}
						</span>
					</span>
					<span class="flex items-center justify-between gap-3 font-main text-sm font-medium text-sage-700">
						{count}
						<span class="text-ink transition-transform duration-500 ease-(--ease-quint) group-hover:translate-x-1.5">
							<ArrowIcon />
						</span>
					</span>
					<span
						id={descriptionId}
						class="hidden font-main text-[0.9375rem] leading-relaxed text-sage-700 md:line-clamp-4"
					>
						{description}
					</span>
				</button>
			</li>
		);
	},
);

interface CategoryListProps {
	groups: DisplayServiceGroup[];
	titles: Record<string, string>;
	treatmentsLabel: string;
	fromPriceLabel: string;
	categoryDescriptionLabels: CategoryDescriptionLabels;
	idPrefix: string;
	columns: "overview" | "laser";
	onOpen: (groupId: string, categoryName: string, serviceCount: number) => void;
}

const CategoryList = component$<CategoryListProps>(
	({
		groups,
		titles,
		treatmentsLabel,
		fromPriceLabel,
		categoryDescriptionLabels,
		idPrefix,
		columns,
		onOpen,
	}) => {
		const t = inlineTranslate();
		const priceLocale = useSpeakLocale().lang;
		return (
			<>
				{/* Phones: every category one tap away, not several swipes. */}
				<ul
					class="mb-5 flex flex-wrap gap-2 md:hidden"
					aria-label={t("app.services.index_label@@Jump to a treatment")}
				>
					{groups.map((group) => {
						const title = capitalizeFirst(
							titles[group.groupId] || group.displayTitle,
						);
						return (
							<li key={group.groupId}>
								<button
									type="button"
									onClick$={$(() => {
										onOpen(group.groupId, title, group.groupServices.length);
									})}
									class="btn btn-outline h-11 min-h-11 border-ink px-4 font-main text-sm font-medium text-ink hover:bg-ink hover:text-linen"
								>
									{title}
								</button>
							</li>
						);
					})}
				</ul>
				<ul
					class={[
						"-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3.5 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0",
						columns === "overview"
							? "md:grid-cols-3 xl:grid-cols-5"
							: "md:grid-cols-2 lg:grid-cols-4",
					]}
				>
					{groups.map((group, index) => {
						const title = capitalizeFirst(
							titles[group.groupId] || group.displayTitle,
						);
						const startingPrice = getCategoryStartingPrice(
							group.groupServices,
							fromPriceLabel,
							priceLocale,
						);
						// Add-ons (repairs, removal) are not counted as treatments.
						const count = `${getMainServices(group.groupServices).length} ${treatmentsLabel}`;
						return (
							<CategoryTile
								key={group.groupId}
								index={index}
								title={title}
								description={getCategoryDescription(
									group.category,
									categoryDescriptionLabels,
								)}
								price={startingPrice}
								count={count}
								image={resolveCoverImage(group.coverImageName)}
								tileId={`${idPrefix}-${group.groupId}`}
								onOpen$={$(() => {
									onOpen(group.groupId, title, group.groupServices.length);
								})}
							/>
						);
					})}
				</ul>
			</>
		);
	},
);

interface ServiceRowProps {
	service: Service;
	price: string;
	location: string;
	category?: string;
}

const ServiceRow = component$<ServiceRowProps>(
	({ service, price, location, category }) => {
		const t = inlineTranslate();
		return (
			<li class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 border-b border-base-300 py-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-start">
				<div class="min-w-0">
					<h4 class="font-cormorant text-2xl leading-tight text-base-content md:text-[1.75rem]">
						{service.name.charAt(0).toUpperCase() + service.name.slice(1)}
					</h4>
					{service.duration ? (
						<p class="mt-1 font-main text-sm font-semibold text-base-content/80">
							{service.duration}&nbsp;{t("app.services.minutes@@min")}
						</p>
					) : null}
				</div>
				<p class="font-cormorant text-2xl leading-tight text-base-content md:col-start-2 md:row-start-1 md:min-w-20 md:text-right md:text-[1.75rem]">
					{price}
				</p>
				{service.description ? (
					<div class="col-span-2 md:col-span-1 md:col-start-1 md:row-start-2">
						<ExpandableText text={service.description} />
					</div>
				) : null}
				<div class="col-span-2 md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1">
					<Booking
						id={`modal_service_${service.id}`}
						// Timely service ID: opens the widget on this treatment.
						product={service.id}
						text={t("app.book.book_now@@Book Now")}
						location={location}
						classes="btn btn-outline btn-sm h-11 min-h-11 border-neutral px-5 font-main text-sm font-semibold"
						analyticsPlacement="service_row"
						analyticsServiceId={service.id}
						analyticsServiceName={service.name}
						analyticsServiceCategory={category}
					/>
				</div>
			</li>
		);
	},
);

type CategoryDescriptionLabels = {
	manicure: string;
	pedicure: string;
	brows: string;
	laser: string;
	waxing: string;
	general: string;
};

interface DetailViewProps {
	displayGroups: DisplayServiceGroup[];
	laserSubgroups: DisplayServiceGroup[];
	selectedCategoryId: string | null;
	selectedLaserSubgroupId: string | null;
	treatmentsLabel: string;
	fromPriceLabel: string;
	defaultCategoryLabel: string;
	laserCategoryLabel: string;
	categoryDescriptionLabels: CategoryDescriptionLabels;
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
		const priceLocale = useSpeakLocale().lang;
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
		const activeStartingPrice = activeDetailGroup
			? getCategoryStartingPrice(
					activeDetailGroup.groupServices,
					fromPriceLabel,
					priceLocale,
				)
			: undefined;

		return (
			<div class="space-y-8 md:space-y-10">
				{activeDetailGroup ? (
					<section
						id={serviceDetailsCardId}
						data-testid={serviceDetailsCardId}
						aria-labelledby={serviceDetailsHeadingId}
						class="scroll-mt-24 border-t border-neutral pt-6 md:pt-8"
					>
						<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
							<div>
								<p class="font-main text-sm font-semibold text-base-content/80">
									{[
										activeStartingPrice,
										`${getMainServices(activeDetailGroup.groupServices).length} ${treatmentsLabel}`,
									]
										.filter(Boolean)
										.join(" · ")}
								</p>
								<h3
									id={serviceDetailsHeadingId}
									tabIndex={-1}
									class="mt-2 text-balance font-cormorant text-[2.5rem] leading-none text-base-content md:text-6xl"
								>
									{getDisplayCategoryName(
										activeDetailGroup.category,
										activeDetailGroup.displayTitle || defaultCategoryLabel,
									)}
								</h3>
							</div>
							<p class="max-w-md text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80">
								{getCategoryDescription(
									activeDetailGroup.category,
									categoryDescriptionLabels,
								)}
							</p>
						</div>
					</section>
				) : null}

				{/* Back links and category chips stay stuck under the site header while
				    the treatments scroll past (sibling of the list, not of the header). */}
				<div class="sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 -mx-4 flex items-center gap-2 border-b border-base-300 bg-base-200/95 px-4 py-2.5 backdrop-blur-sm sm:-mx-6 sm:px-6 md:mx-0 md:gap-5 md:px-0">
					<div
						data-testid="service-back-actions"
						class="flex shrink-0 items-center gap-1 border-r border-base-300 pr-2 md:gap-5 md:pr-5"
					>
						<button
							type="button"
							onClick$={onResetOverview}
							aria-label={backLabel}
							class="btn btn-ghost h-11 min-h-11 shrink-0 gap-2 border-0 px-2.5 font-main text-sm font-semibold hover:bg-base-200 md:px-0 md:hover:bg-transparent md:hover:underline md:underline-offset-[6px]"
						>
							<span aria-hidden="true">←</span>
							<span class="hidden md:inline">{backLabel}</span>
						</button>
						{selectedLaserSubgroupId ? (
							<button
								type="button"
								onClick$={onResetLaserSubgroup}
								aria-label={backToLaserLabel}
								class="btn btn-ghost h-11 min-h-11 shrink-0 gap-2 border-0 px-2.5 font-main text-sm font-semibold hover:bg-base-200 md:px-0 md:hover:bg-transparent md:hover:underline md:underline-offset-[6px]"
							>
								<span aria-hidden="true">←</span>
								<span class="md:hidden">{laserCategoryLabel}</span>
								<span class="hidden md:inline">{backToLaserLabel}</span>
							</button>
						) : null}
					</div>
					<nav
						id={serviceCategoryNavId}
						class="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
						aria-label={servicesAriaLabel}
					>
						<div class="flex w-max gap-2">
							{displayGroups.map((group) => {
								const categoryName = capitalizeFirst(
									group.displayTitle ||
										getDisplayCategoryName(
											group.category,
											defaultCategoryLabel,
										) ||
										defaultCategoryLabel,
								);
								const isSelected = group.groupId === selectedCategoryId;

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
											"btn btn-sm h-11 min-h-11 shrink-0 border-neutral px-4 font-main text-sm font-semibold whitespace-nowrap",
											isSelected ? "btn-neutral" : "btn-outline",
										]}
										aria-pressed={isSelected}
									>
										{categoryName}
									</button>
								);
							})}
						</div>
					</nav>
				</div>

				{selectedGroup?.groupId === "laser" && !selectedLaserSubgroup ? (
					<CategoryList
						groups={laserSubgroups}
						titles={Object.fromEntries(
							laserSubgroups.map((group) => [
								group.groupId,
								getDisplayCategoryName(group.category, laserCategoryLabel) ||
									group.displayTitle ||
									laserCategoryLabel,
							]),
						)}
						treatmentsLabel={treatmentsLabel}
						fromPriceLabel={fromPriceLabel}
						categoryDescriptionLabels={categoryDescriptionLabels}
						idPrefix="laser"
						columns="laser"
						onOpen={onLaserSubgroupOpen}
					/>
				) : (
					displayGroups
						.filter((group) =>
							selectedCategoryId ? group.groupId === selectedCategoryId : true,
						)
						.map((group) => {
							const renderGroup =
								group.groupId === "laser" && selectedLaserSubgroup
									? selectedLaserSubgroup
									: group;

							return (
								<ul
									key={renderGroup.groupId}
									class="max-w-4xl border-t border-base-300"
								>
									{[
										// Treatments first, add-ons (repairs, nail art, removal) last.
										...renderGroup.groupServices.filter(
											(service) => !isAddOnService(service),
										),
										...renderGroup.groupServices.filter((service) =>
											isAddOnService(service),
										),
									].map((service) => {
										const serviceCategory =
											categoryById.get(String(service.group_id)) ||
											renderGroup.category;
										return (
											<ServiceRow
												key={service.id}
												service={service}
												price={formatPrice(service.price, priceLocale)}
												location={location}
												category={
													serviceCategory?.name || renderGroup.displayTitle
												}
											/>
										);
									})}
								</ul>
							);
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
		const priceLocale = useSpeakLocale().lang;
		const categoryById = createCategoryIndex(serviceCategories);
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
			waxing: t(
				"app.services.waxing_desc@@Quick, precise waxing for brows, upper lip, chin, cheeks and the full face.",
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
			return buildLaserSubgroups(groupedServices.value, laserCategoryLabel);
		});

		const displayGroups = useComputed$<DisplayServiceGroup[]>(() => {
			return buildDisplayGroups(
				groupedServices.value,
				defaultCategoryLabel,
				laserCategoryLabel,
			);
		});

		// ── Actions ──
		const resetOverview = $(() => {
			showFullList.value = false;
			selectedCategoryId.value = null;
			selectedLaserSubgroupId.value = null;
			updateTreatmentUrl();
			revealServicesTop();
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
			const selection = resolveTreatmentSelection(
				displayGroups.value,
				laserSubgroups.value,
				categoryId,
				subgroupId,
			);

			selectedCategoryId.value = selection.selectedCategoryId;
			selectedLaserSubgroupId.value = selection.selectedLaserSubgroupId;
			showFullList.value = selection.showFullList;
		});

		useOnWindow("popstate", restoreTreatmentState);
		useOnWindow("hashchange", restoreTreatmentState);

		const lowestAddOnPrice = getLowestAddOnPrice(services);
		const allPricesLabel = t("app.services.all_prices@@All prices");
		const consultationQuestion = t(
			"app.services.consultation_question@@Not sure which to choose?",
		);
		const trackPricing = $(() => {
			trackGoogleAnalyticsEvent("pricing_link_clicked", {
				placement: "services_cta",
			});
		});
		const trackConsultation = $(() => {
			trackGoogleAnalyticsEvent("instagram_clicked", {
				placement: "services_consultation",
				target_type: "message",
				link_url: SITE_METADATA.socials.instagramMessage,
			});
		});
		const groupTitles = Object.fromEntries(
			displayGroups.value.map((group) => [
				group.groupId,
				group.displayTitle ||
					getDisplayCategoryName(group.category, defaultCategoryLabel) ||
					defaultCategoryLabel,
			]),
		);

		return (
			<SectionWrapper
				id="services"
				background="base-200"
				watermark="Aesthetic Lab"
			>
				<div class="mb-6 grid gap-6 md:mb-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-16">
					<div class="flex items-end justify-between gap-4">
						<FadeUp>
							<KickerLabel>
								{t("app.services.catalogue@@Treatments")}
							</KickerLabel>
							<h2 class="text-balance font-cormorant text-[2.875rem] leading-[0.95] text-base-content md:text-7xl lg:text-[5.5rem] lg:leading-[0.9]">
								{titleLabel}
							</h2>
						</FadeUp>
						<a
							href="pricelist"
							onClick$={trackPricing}
							class="link inline-flex min-h-11 shrink-0 items-center font-main text-sm font-semibold underline-offset-[5px] lg:hidden"
						>
							{allPricesLabel}
						</a>
					</div>

					<div class="hidden flex-col gap-4.5 lg:flex">
						{lowestAddOnPrice ? (
							<p class="font-cormorant text-[1.375rem] leading-snug text-base-content italic">
								{t(
									"app.services.add_on_note@@Prices are for the treatment itself. Repairs, nail art and removal are add-ons from {{price}}.",
									{ price: formatPrice(lowestAddOnPrice, priceLocale) },
								)}
							</p>
						) : null}
						<a
							href="pricelist"
							onClick$={trackPricing}
							class="link inline-flex min-h-11 items-center self-start font-main text-sm font-semibold underline-offset-[6px]"
						>
							{viewFullLabel}
						</a>
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
					<CategoryList
						groups={displayGroups.value}
						titles={groupTitles}
						treatmentsLabel={treatmentsLabel}
						fromPriceLabel={fromPriceLabel}
						categoryDescriptionLabels={categoryDescriptionLabels}
						idPrefix="category"
						columns="overview"
						onOpen={openCategory}
					/>
				)}

				<div class="mt-5 md:mt-14 md:flex md:items-center md:justify-between md:gap-8 md:bg-primary md:px-9 md:py-7 md:text-primary-content">
					<p class="font-cormorant text-[1.1875rem] leading-snug text-base-content italic md:text-3xl md:text-primary-content">
						{consultationQuestion}{" "}
						<span class="hidden md:inline">
							{t(
								"app.services.consultation_offer@@We’ll help, free of charge.",
							)}
						</span>{" "}
						<a
							href={SITE_METADATA.socials.instagramMessage}
							target="_blank"
							rel="noopener noreferrer"
							onClick$={trackConsultation}
							class="link font-main text-[0.8125rem] font-semibold not-italic underline-offset-4 md:hidden"
						>
							{t("app.services.ask_us@@Ask us")}
						</a>
					</p>
					<a
						href={SITE_METADATA.socials.instagramMessage}
						target="_blank"
						rel="noopener noreferrer"
						onClick$={trackConsultation}
						class="btn btn-outline hidden h-13 min-h-13 shrink-0 border-primary-content px-7 font-main text-sm font-semibold text-primary-content hover:bg-primary-content hover:text-primary md:inline-flex"
					>
						{t("app.services.ask_consultation@@Ask for a consultation")}
					</a>
				</div>
			</SectionWrapper>
		);
	},
);
