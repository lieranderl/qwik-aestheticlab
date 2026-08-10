import {
	$,
	component$,
	useId,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HiClockOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { formatPremiumPrice } from "~/consts";
import ImgPricelistHero from "~/media/pricelist-hero.png?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import {
	getCategoryStartingPrice,
	getDisplayCategoryName,
} from "~/shared/service-utils";
import type { Service, ServiceGroup } from "~/types";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
} from "../layout";

interface PricelistServiceItemProps {
	service: Service;
	location: string;
	categoryName: string;
}

/** Pricelist-specific override for brows & lashes combined display name. */
function getPricelistCategoryName(
	category: ServiceGroup | undefined,
	fallback: string,
	browsAndLashesLabel: string,
): string {
	const englishName = category?.name_en?.toLowerCase() || "";
	if (englishName.includes("brows") || englishName.includes("lashes")) {
		return browsAndLashesLabel;
	}
	return getDisplayCategoryName(category, fallback);
}

function getCategoryAnchorId(groupId: string) {
	return `pricing-category-${groupId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function getCategoryNumber(index: number) {
	return String(index + 1).padStart(2, "0");
}

const PricelistServiceItem = component$(
	({ service, location, categoryName }: PricelistServiceItemProps) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const descriptionId = useId();
		const readLessLabel = t("app.common.read_less@@Read Less");
		const readMoreLabel = t("app.common.read_more@@Read More");

		return (
			<article class="border-t border-base-300 py-5 first:border-t-0 first:pt-0 last:pb-0 md:py-6">
				<div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-8 md:gap-y-3">
					<div class="min-w-0">
						<div class="flex items-start justify-between gap-4">
							<h3 class="font-main text-base leading-snug font-semibold text-base-content md:text-lg">
								{service.name}
							</h3>
							<span class="shrink-0 font-main text-lg leading-none font-semibold text-secondary tabular-nums md:hidden">
								{formatPremiumPrice(service.price)}
							</span>
						</div>

						{service.description ? (
							<div class="mt-2">
								<p
									id={descriptionId}
									class={[
										"max-w-3xl font-main text-sm leading-6 text-base-content md:leading-7",
										isExpanded.value ? "" : "line-clamp-2 md:line-clamp-none",
									]}
								>
									{service.description}
								</p>
								{service.description.length > 100 ? (
									<button
										type="button"
										onClick$={$(() => {
											isExpanded.value = !isExpanded.value;
										})}
										class="btn btn-ghost btn-sm mt-1 min-h-11 px-0 font-main text-xs text-secondary md:hidden"
										aria-expanded={isExpanded.value}
										aria-controls={descriptionId}
									>
										{isExpanded.value ? readLessLabel : readMoreLabel}
									</button>
								) : null}
							</div>
						) : null}

						{service.duration ? (
							<div class="mt-3 flex items-center gap-2 font-main text-xs font-medium uppercase tracking-wider text-base-content">
								<HiClockOutline class="size-4" aria-hidden="true" />
								<span>
									{service.duration}&nbsp;{t("app.services.minutes@@min")}
								</span>
							</div>
						) : null}
					</div>

					<div class="flex flex-col gap-3 md:min-w-40 md:items-end md:justify-between">
						<span class="hidden font-main text-2xl leading-none font-semibold text-secondary tabular-nums md:block">
							{formatPremiumPrice(service.price)}
						</span>
						<Booking
							id={`pricelist_service_${service.id}`}
							text={t("app.book.book_now@@Book Now")}
							location={location}
							classes="btn btn-outline btn-sm min-h-11 w-full rounded-full px-6 font-main text-xs font-semibold uppercase tracking-[0.1em] md:w-auto"
							analyticsPlacement="pricelist_service"
							analyticsServiceId={service.id}
							analyticsServiceName={service.name}
							analyticsServiceCategory={categoryName}
						/>
					</div>
				</div>
			</article>
		);
	},
);

export default component$(() => {
	const t = inlineTranslate();
	const services = useServicesLoader().value;
	const categories = useServiceGroupsLoader().value;
	const contact = useContactLoader().value;
	const defaultCategoryLabel = t("app.services.default_category@@Services");
	const categoryLabel = t("app.pricelist.category_label@@Category");
	const categoryNavLabel = t("app.pricelist.category_nav@@Service categories");
	const fromPriceLabel = t("app.services.from_price@@From");
	const browsAndLashesLabel = t(
		"app.services.brows_lashes_title@@Brows & Lashes",
	);

	// biome-ignore lint/correctness/noQwikUseVisibleTask: GA events require browser-only gtag state.
	useVisibleTask$(() => {
		trackGoogleAnalyticsEvent("pricing_viewed", {
			placement: "pricelist_page",
			category_count: categories.length,
			service_count: services.length,
		});
	});

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
			const sortedServices = [...groupServices].sort(
				(a, b) => a.price - b.price,
			);
			const displayCategoryName = getPricelistCategoryName(
				category,
				defaultCategoryLabel,
				browsAndLashesLabel,
			);
			return {
				groupId,
				groupServices: sortedServices,
				category,
				priority: category?.priority ?? 0,
				displayCategoryName,
				anchorId: getCategoryAnchorId(groupId),
				startingPriceLabel: getCategoryStartingPrice(
					sortedServices,
					fromPriceLabel,
				),
			};
		})
		.sort((a, b) => b.priority - a.priority);
	return (
		<div class="min-h-screen bg-base-100">
			<Navigation />

			<main>
				{/* Hero */}
				<section class="hero relative min-h-96 overflow-hidden bg-primary pt-16 md:min-h-128 md:pt-20">
					<div class="absolute inset-0">
						<ImgPricelistHero
							alt={t(
								"app.pricelist.hero_alt@@Aesthetic Lab treatment catalog background",
							)}
							class="h-full w-full object-cover opacity-85"
							loading="eager"
							fetchPriority="high"
						/>
						<div class="hero-overlay absolute inset-0 bg-primary/55" />
					</div>
					<div class="hero-content relative z-10 w-full max-w-7xl justify-center px-4 py-12 md:px-8 md:py-16 opacity-95">
						<div class="card card-border mx-auto w-full max-w-xl bg-base-100/90 p-6 text-center text-base-content shadow-sm md:p-9">
							<h1 class="font-cormorant text-4xl leading-tight md:text-5xl">
								{t("app.services.pricing_title@@Services & Pricing")}
							</h1>
							<div class="mx-auto my-4 h-px w-16 bg-secondary/40 md:my-5" />
							<p class="mx-auto max-w-lg font-main text-sm leading-6 text-base-content/85 md:text-base md:leading-7">
								{t(
									"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
								)}
							</p>
							<div class="mt-6 flex justify-center">
								<Booking
									id="hero_pricelist_book"
									text={t("app.hero.book_appointment@@Book Appointment")}
									location={contact?.location.name || ""}
									classes="btn btn-outline btn-md min-h-12 rounded-full px-8 font-main text-xs font-semibold uppercase tracking-[0.12em]"
									analyticsPlacement="pricelist_hero"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Pricing List */}
				<section class="scroll-mt-24 border-y border-base-300/30 bg-base-200 py-16 md:py-24 lg:py-28">
					<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
						{groupedServices.length > 1 ? (
							<nav
								class="card card-border sticky top-16 z-20 -mx-1 mb-8 bg-base-100/98 p-2 shadow-md transition-[box-shadow,border-color] duration-200 md:top-20 md:mb-12 md:p-3"
								aria-label={categoryNavLabel}
							>
								<div class="flex snap-x gap-2 overflow-x-auto overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
									{groupedServices.map(
										({ groupId, displayCategoryName, anchorId }, index) => (
											<a
												key={groupId}
												href={`#${anchorId}`}
												class="btn btn-ghost btn-sm min-h-11 shrink-0 snap-start rounded-full border border-base-300 bg-base-100 font-main text-base-content uppercase tracking-wider hover:border-base-content/40 hover:bg-base-200"
											>
												<span class="text-secondary/90">
													{getCategoryNumber(index)}
												</span>
												{displayCategoryName}
											</a>
										),
									)}
								</div>
							</nav>
						) : null}

						{groupedServices.length === 0 ? (
							<div
								class="alert border border-base-300 bg-base-100"
								role="status"
							>
								<span>
									{t(
										"app.pricelist.empty@@Pricing is temporarily unavailable. Please contact us for current treatment information.",
									)}
								</span>
							</div>
						) : null}

						<div class="space-y-8 md:space-y-12">
							{groupedServices.map(
								(
									{
										groupId,
										groupServices,
										displayCategoryName,
										anchorId,
										startingPriceLabel,
									},
									index,
								) => {
									return (
										<FadeUp key={groupId} delay={Math.min(index, 5) * 60}>
											<section
												id={anchorId}
												class="card card-border scroll-mt-36 bg-base-100 shadow-md transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg"
											>
												<div class="card-body gap-0 p-4 md:p-8">
													<div class="mb-6 flex flex-col gap-4 md:mb-8">
														<div class="flex items-center gap-4">
															<span class="badge badge-soft badge-lg size-11 shrink-0 rounded-full p-0 font-main text-xs font-semibold tracking-[0.12em] md:size-12">
																{getCategoryNumber(index)}
															</span>
															<div class="h-px flex-1 bg-base-300/50" />
															{startingPriceLabel ? (
																<span class="badge badge-soft shrink-0 rounded-full font-main">
																	{startingPriceLabel}
																</span>
															) : null}
														</div>
														<div>
															<p class="font-main text-xs uppercase tracking-[0.2em] text-base-content md:tracking-[0.24em]">
																{categoryLabel}
															</p>
															<h2 class="font-cormorant text-3xl text-base-content md:text-4xl">
																{displayCategoryName}
															</h2>
														</div>
													</div>

													<div>
														{groupServices.map((service) => (
															<PricelistServiceItem
																key={service.id}
																service={service}
																location={contact?.location.name || ""}
																categoryName={displayCategoryName}
															/>
														))}
													</div>
												</div>
											</section>
										</FadeUp>
									);
								},
							)}
						</div>
					</div>
				</section>

				{/* Bottom CTA */}
				<section class="bg-base-100 px-4 py-16 text-center md:py-24 lg:py-28">
					<FadeUp class="card card-border mx-auto max-w-3xl bg-base-200/35 transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg">
						<div class="card-body items-center px-5 py-10 md:p-14">
							<p class="mb-4 font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
								{t("app.pricelist.ready@@Ready when you are")}
							</p>
							<h2 class="mb-6 text-balance font-cormorant text-4xl leading-none text-base-content md:text-5xl">
								{t("app.hero.book_visit@@Book Your Visit")}
							</h2>
							<Booking
								id="bottom_pricelist_book"
								text={t("app.hero.book_appointment@@Book Appointment")}
								location={contact?.location.name || ""}
								classes="btn btn-outline btn-md h-12 min-h-12 rounded-full px-8 font-main uppercase tracking-[0.12em]"
								analyticsPlacement="pricelist_bottom"
							/>
						</div>
					</FadeUp>
				</section>
			</main>

			<Footer />
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
