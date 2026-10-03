import {
	$,
	component$,
	type PropFunction,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { Booking } from "~/components/ui/booking-modal";
import { KickerLabel } from "~/components/ui/kicker-label";
import { ScrollToTop } from "~/components/ui/scroll-to-top";
import { formatPrice } from "~/consts";
import ImgPricelistHero from "~/media/pricelist-hero.png?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { resolveImageComponent } from "~/shared/image-resolver";
import {
	buildDisplayGroups,
	buildLaserSubgroups,
	type DisplayServiceGroup,
} from "~/shared/service-catalog";
import {
	capitalizeFirst,
	getCategoryDescription,
	getCategoryStartingPrice,
	getDisplayCategoryName,
	groupServicesAndCategories,
	isAddOnService,
	resolveCoverImage,
} from "~/shared/service-utils";
import type { Service } from "~/types";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
} from "../layout";

function getGroupTitle(group: DisplayServiceGroup, fallback: string) {
	return capitalizeFirst(
		group.displayTitle || getDisplayCategoryName(group.category, fallback),
	);
}

/** "Laser hair removal FACE" → "face", used to pick a translated tab label. */
function getLaserSubgroupKey(group: DisplayServiceGroup) {
	return (group.category?.name_en || group.displayTitle)
		.replace(/laser hair removal/i, "")
		.trim()
		.toLowerCase();
}

function getLaserLabel(
	group: DisplayServiceGroup,
	labels: Record<string, string>,
) {
	return labels[getLaserSubgroupKey(group)] ?? group.displayTitle;
}

const tableColumns =
	"grid grid-cols-[minmax(0,1fr)_auto_1.125rem] items-center gap-x-3 md:grid-cols-[minmax(0,1fr)_5.625rem_4.375rem_1.5rem] md:items-baseline md:gap-x-5";

interface PriceRowProps {
	service: Service;
	price: string;
	minutesLabel: string;
	location: string;
	categoryName: string;
	isOpen: boolean;
	onToggle$: PropFunction<() => void>;
}

const PriceRow = component$<PriceRowProps>(
	({
		service,
		price,
		minutesLabel,
		location,
		categoryName,
		isOpen,
		onToggle$,
	}) => {
		const t = inlineTranslate();
		const panelId = `price-row-${service.id}`;
		const duration = service.duration
			? `${service.duration} ${minutesLabel}`
			: "";
		return (
			<li
				class={[
					"border-b border-base-300 transition-colors duration-300",
					isOpen ? "bg-base-200/70 md:-mx-5 md:px-5" : "",
				]}
			>
				<button
					type="button"
					onClick$={onToggle$}
					aria-expanded={isOpen}
					aria-controls={panelId}
					class={[
						tableColumns,
						"min-h-14 w-full cursor-pointer py-3 text-left md:py-4",
					]}
				>
					<span class="flex min-w-0 flex-col gap-0.5">
						<span class="font-cormorant text-[1.3125rem] leading-[1.1] md:text-2xl">
							{service.name.charAt(0).toUpperCase() + service.name.slice(1)}
						</span>
						<span class="font-main text-xs font-medium text-base-content/80 md:hidden">
							{duration}
						</span>
					</span>
					<span class="hidden font-main text-sm text-base-content/80 md:block">
						{duration}
					</span>
					<span class="font-main text-[0.9375rem] font-semibold tabular-nums md:text-right md:text-base">
						{price}
					</span>
					<span aria-hidden="true" class="font-main text-xl leading-none">
						{isOpen ? "−" : "+"}
					</span>
				</button>
				<div
					id={panelId}
					hidden={!isOpen}
					class="flex flex-col gap-3 pb-4 md:pb-5.5"
				>
					{service.description ? (
						<p class="max-w-140 font-main text-sm leading-relaxed text-base-content md:text-[0.9375rem] md:leading-[1.6]">
							{service.description}
						</p>
					) : null}
					<Booking
						id={`pricelist_service_${service.id}`}
						// Timely service ID: opens the widget on this treatment.
						product={service.id}
						text={t("app.pricelist.book_treatment@@Book this treatment")}
						location={location}
						classes="btn btn-outline btn-sm h-11 min-h-11 self-start border-neutral px-4.5 font-main text-sm font-semibold md:px-5"
						analyticsPlacement="pricelist_service"
						analyticsServiceId={service.id}
						analyticsServiceName={service.name}
						analyticsServiceCategory={categoryName}
					/>
				</div>
			</li>
		);
	},
);

export default component$(() => {
	const t = inlineTranslate();
	const priceLocale = useSpeakLocale().lang;
	const location = useLocation();
	const services = useServicesLoader().value;
	const categories = useServiceGroupsLoader().value;
	const contact = useContactLoader().value;
	const bookingLocation = contact?.location.name || "";

	const defaultCategoryLabel = t("app.services.default_category@@Services");
	const laserCategoryLabel = t("app.services.laser_category@@Laser");
	const fromPriceLabel = t("app.services.from_price@@From");
	const minutesLabel = t("app.services.minutes@@min");
	const treatmentsLabel = t("app.services.treatments@@Treatments");
	const categoryNavLabel = t("app.pricelist.category_nav@@Service categories");
	const laserSubgroupLabels: Record<string, string> = {
		face: t("app.pricelist.laser_face@@Face"),
		body: t("app.pricelist.laser_body@@Body"),
		combo: t("app.pricelist.laser_sets@@Sets"),
		male: t("app.pricelist.laser_men@@Men"),
	};
	const descriptionLabels = {
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

	const grouped = useComputed$(() =>
		groupServicesAndCategories(services, categories),
	);
	const displayGroups = useComputed$<DisplayServiceGroup[]>(() =>
		buildDisplayGroups(grouped.value, defaultCategoryLabel, laserCategoryLabel),
	);
	const laserSubgroups = useComputed$<DisplayServiceGroup[]>(() =>
		buildLaserSubgroups(grouped.value, laserCategoryLabel),
	);

	const requestedCategory = location.url.searchParams.get("category");
	const selectedCategoryId = useSignal(
		displayGroups.value.some((group) => group.groupId === requestedCategory)
			? (requestedCategory as string)
			: (displayGroups.value[0]?.groupId ?? ""),
	);
	const selectedLaserSubgroupId = useSignal(
		laserSubgroups.value[0]?.groupId ?? "",
	);
	const openServiceId = useSignal<string | null>(null);

	const selectCategory = $((groupId: string, name: string) => {
		selectedCategoryId.value = groupId;
		openServiceId.value = null;
		const url = new URL(window.location.href);
		url.searchParams.set("category", groupId);
		history.replaceState(null, "", url);
		trackGoogleAnalyticsEvent("service_category_viewed", {
			category_id: groupId,
			service_category: name,
			placement: "pricelist_tabs",
		});
	});

	// biome-ignore lint/correctness/noQwikUseVisibleTask: GA events require browser-only gtag state.
	useVisibleTask$(() => {
		// Deep links (?category=laser) may select a tab that is off-screen on phones.
		document
			.querySelector('#pricelist-tabs [aria-current="true"]')
			?.scrollIntoView({ block: "nearest", inline: "center" });
		trackGoogleAnalyticsEvent("pricing_viewed", {
			placement: "pricelist_page",
			category_count: categories.length,
			service_count: services.length,
		});
	});

	const groups = displayGroups.value;
	const activeIndex = Math.max(
		0,
		groups.findIndex((group) => group.groupId === selectedCategoryId.value),
	);
	const activeGroup = groups[activeIndex];
	const activeLaserSubgroup =
		laserSubgroups.value.find(
			(group) => group.groupId === selectedLaserSubgroupId.value,
		) ?? laserSubgroups.value[0];
	const isLaser = activeGroup?.groupId === "laser";
	// Header photo follows the selected category (laser: the selected area).
	const covers: { id: string; image: string }[] = [];
	for (const group of [...groups, ...laserSubgroups.value]) {
		const image = resolveCoverImage(group.coverImageName);
		if (
			resolveImageComponent(image) &&
			!covers.some((c) => c.id === group.groupId)
		) {
			covers.push({ id: group.groupId, image });
		}
	}
	const activeCoverId =
		isLaser &&
		activeLaserSubgroup &&
		covers.some((c) => c.id === activeLaserSubgroup.groupId)
			? activeLaserSubgroup.groupId
			: activeGroup?.groupId;
	return (
		<div class="min-h-screen bg-base-100 text-base-content">
			<Navigation />

			<main id="main-content" tabIndex={-1} class="pt-16 lg:pt-20">
				<section class="grid lg:h-100 lg:grid-cols-[minmax(0,37.5rem)_minmax(0,1fr)]">
					<div class="flex flex-col justify-end gap-3 bg-primary px-5.5 pt-7 pb-6.5 text-primary-content md:px-10 lg:gap-5 lg:py-14 lg:pr-18 lg:pl-16 xl:pl-28">
						<KickerLabel tone="sage" class="mb-0">
							{t("app.pricelist.kicker@@Price list")}
						</KickerLabel>
						<h1 class="font-cormorant text-[2.875rem] leading-[0.95] lg:text-[5rem] lg:leading-[0.92]">
							{t("app.pricelist.title@@Prices & time")}
						</h1>
						<p class="max-w-95 font-main text-sm leading-normal lg:text-base lg:leading-[1.55]">
							{t(
								"app.pricelist.intro@@Every treatment with its duration. Prices are for the treatment itself; add-ons are listed separately.",
							)}
						</p>
					</div>
					<figure class="relative h-56 overflow-hidden bg-sage-200 sm:h-72 lg:h-auto">
						{covers.some((c) => c.id === activeCoverId) ? null : (
							<ImgPricelistHero
								alt=""
								class="absolute inset-0 h-full w-full object-cover object-[center_45%]"
								loading="eager"
								sizes="(min-width: 1024px) calc(100vw - 37.5rem), 100vw"
							/>
						)}
						{/* Photos cross-fade: the next one is fully loaded underneath, so
						    the frame never goes blank. */}
						{covers.map((cover) => {
							const Cover = resolveImageComponent(cover.image);
							const isActive = cover.id === activeCoverId;
							return Cover ? (
								<Cover
									key={cover.id}
									alt=""
									class={[
										"absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-(--ease-quint) motion-reduce:transition-none",
										isActive ? "opacity-100" : "opacity-0",
									]}
									loading={isActive ? "eager" : "lazy"}
									sizes="(min-width: 1024px) calc(100vw - 37.5rem), 100vw"
								/>
							) : null;
						})}
					</figure>
				</section>

				{groups.length === 0 ? (
					<div class="mx-auto max-w-3xl px-5.5 py-16">
						<div class="alert border border-base-300 bg-base-100" role="status">
							<span>
								{t(
									"app.pricelist.empty@@Pricing is temporarily unavailable. Please contact us for current treatment information.",
								)}
							</span>
						</div>
					</div>
				) : (
					<>
						{/* Non-sticky anchor: the tabs below stick, so they cannot be a scroll target. */}
						<div id="pricelist-categories" class="scroll-mt-16" />
						<nav
							id="pricelist-tabs"
							aria-label={categoryNavLabel}
							class="sticky top-16 z-20 overflow-x-auto overscroll-x-contain border-b border-neutral bg-base-100 [scrollbar-width:none] lg:top-16"
						>
							<ul class="flex w-max gap-0 px-2.5 md:px-10 lg:gap-10 lg:px-16 xl:px-28">
								{groups.map((group, index) => {
									const isActive = index === activeIndex;
									const title = getGroupTitle(group, defaultCategoryLabel);
									return (
										<li key={group.groupId}>
											{/* A real link, so crawlers and no-JS visitors can
											    reach each category; JS switches in place. */}
											<a
												href={`?category=${group.groupId}`}
												aria-current={isActive ? "true" : undefined}
												preventdefault:click
												onClick$={() => selectCategory(group.groupId, title)}
												class={[
													"-mb-px flex min-h-13 cursor-pointer items-center gap-2.5 border-b-2 px-3 font-main text-sm font-semibold whitespace-nowrap transition-colors lg:min-h-18 lg:px-0 lg:text-xs",
													isActive
														? "border-neutral text-base-content"
														: "border-transparent text-base-content/70 hover:text-base-content",
												]}
											>
												<span class="hidden text-primary-content/80 lg:inline">
													{String(index + 1).padStart(2, "0")}
												</span>
												{title}
											</a>
										</li>
									);
								})}
							</ul>
						</nav>

						{/* Every category is in the HTML (search engines don't click tabs);
    only the selected one is shown. */}
						{groups.map((group, index) => {
							const isActive = index === activeIndex;
							const isLaserGroup = group.groupId === "laser";
							const lists =
								isLaserGroup && laserSubgroups.value.length > 0
									? laserSubgroups.value
									: [group];
							const visibleList =
								isLaserGroup && activeLaserSubgroup
									? activeLaserSubgroup
									: lists[0];
							const title = getGroupTitle(group, defaultCategoryLabel);
							const headingId = `pricelist-${group.groupId}-title`;
							const visibleCount = visibleList.groupServices.filter(
								(service) => !isAddOnService(service),
							).length;
							const startingPrice = getCategoryStartingPrice(
								group.groupServices,
								fromPriceLabel,
								priceLocale,
							);
							return (
								<section
									key={group.groupId}
									hidden={!isActive}
									aria-labelledby={headingId}
									class="mx-auto grid max-w-360 gap-4.5 px-4.5 pt-4.5 pb-16 md:px-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-24 lg:px-16 lg:pt-18 lg:pb-22 xl:px-28"
								>
									<aside class="flex flex-col gap-3 lg:sticky lg:top-40 lg:gap-5.5 lg:self-start">
										<span class="hidden font-main text-xs font-semibold tracking-[0.2em] text-primary-content/80 lg:block">
											{String(index + 1).padStart(2, "0")} /{" "}
											{String(groups.length).padStart(2, "0")}
										</span>
										<div class="flex items-baseline justify-between gap-4">
											<h2
												id={headingId}
												class="font-cormorant text-[2rem] leading-none lg:text-7xl lg:leading-[0.9]"
											>
												{visibleList === group
													? title
													: `${title} · ${getLaserLabel(visibleList, laserSubgroupLabels)}`}
											</h2>
											<span class="font-main text-sm font-semibold whitespace-nowrap text-base-content/80 lg:hidden">
												{visibleCount} {treatmentsLabel}
											</span>
										</div>

										<p class="hidden font-cormorant text-[1.3125rem] leading-[1.35] italic lg:block">
											{getCategoryDescription(
												group.category,
												descriptionLabels,
											)}
										</p>
										<div class="hidden items-center gap-5 lg:flex">
											<Booking
												id={`pricelist-${group.groupId}-book`}
												text={t("app.book.book_app@@Book Appointment")}
												location={bookingLocation}
												analyticsPlacement="pricelist_category"
												analyticsServiceCategory={title}
												classes="btn btn-neutral h-13 min-h-13 px-6.5 font-main text-sm font-semibold"
											/>
											{startingPrice ? (
												<span class="font-main text-sm font-semibold text-base-content/80">
													{startingPrice}
												</span>
											) : null}
										</div>
									</aside>

									<div>
										{lists.length > 1 ? (
											<div class="mb-4.5 flex gap-1.5 lg:mb-8">
												{lists.map((list) => {
													const isListActive = list === visibleList;
													return (
														<button
															key={list.groupId}
															type="button"
															aria-pressed={isListActive}
															aria-controls={`pricelist-list-${list.groupId}`}
															onClick$={() => {
																selectedLaserSubgroupId.value = list.groupId;
																openServiceId.value = null;
															}}
															class={[
																"btn btn-sm h-11 min-h-11 flex-1 border-neutral font-main text-sm font-semibold lg:flex-none lg:px-6",
																isListActive ? "btn-neutral" : "btn-outline",
															]}
														>
															{getLaserLabel(list, laserSubgroupLabels)}
														</button>
													);
												})}
											</div>
										) : null}

										<div
											class={[
												tableColumns,
												"hidden border-b border-neutral pb-3 font-main text-[0.6875rem] font-semibold tracking-[0.2em] text-primary-content/80 uppercase md:grid",
											]}
											aria-hidden="true"
										>
											<span>{t("app.pricelist.treatment@@Treatment")}</span>
											<span>{t("app.pricelist.time@@Time")}</span>
											<span class="text-right">
												{t("app.pricelist.price@@Price")}
											</span>
											<span />
										</div>

										{lists.map((list) => {
											const mainServices = list.groupServices.filter(
												(service) => !isAddOnService(service),
											);
											const addOns = list.groupServices.filter((service) =>
												isAddOnService(service),
											);
											const listTitle =
												list === group
													? title
													: `${title} · ${getLaserLabel(list, laserSubgroupLabels)}`;
											return (
												<div
													key={list.groupId}
													id={`pricelist-list-${list.groupId}`}
													hidden={list !== visibleList}
												>
													<ul class="border-t border-neutral md:border-t-0">
														{mainServices.map((service) => (
															<PriceRow
																key={service.id}
																service={service}
																price={formatPrice(service.price, priceLocale)}
																minutesLabel={minutesLabel}
																location={bookingLocation}
																categoryName={listTitle}
																isOpen={openServiceId.value === service.id}
																onToggle$={() => {
																	openServiceId.value =
																		openServiceId.value === service.id
																			? null
																			: service.id;
																}}
															/>
														))}
													</ul>

													{addOns.length > 0 ? (
														<div class="mt-6.5 lg:mt-10">
															<KickerLabel class="mb-0 border-b border-neutral pb-2 lg:pb-3">
																{t(
																	"app.pricelist.add_ons@@Add-ons · with any treatment",
																)}
															</KickerLabel>
															<ul class="grid font-main text-[0.8125rem] md:grid-cols-2 md:gap-x-10 md:text-sm">
																{addOns.map((service) => (
																	<li
																		key={service.id}
																		class="flex justify-between gap-3 border-b border-base-300 py-3"
																	>
																		<span>
																			{service.name}
																			{service.duration
																				? ` · ${service.duration} ${minutesLabel}`
																				: ""}
																		</span>
																		<strong class="font-semibold whitespace-nowrap tabular-nums">
																			{formatPrice(service.price, priceLocale)}
																		</strong>
																	</li>
																))}
															</ul>
														</div>
													) : null}
												</div>
											);
										})}
									</div>
								</section>
							);
						})}
					</>
				)}
			</main>

			<Footer />
			<ScrollToTop
				targetId="pricelist-categories"
				label={t("app.pricelist.back_to_categories@@Back to categories")}
			/>
		</div>
	);
});

export const head: DocumentHead = () => {
	const t = inlineTranslate();
	return {
		title: t("app.head.pricelist.title@@Services & Pricing | Aesthetic Lab"),
		meta: [
			{
				name: "description",
				content: t(
					"app.head.pricelist.description@@Full price list for manicures, pedicures, brows, and laser treatments.",
				),
			},
		],
	};
};
