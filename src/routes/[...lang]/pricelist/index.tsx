import {
	$,
	component$,
	useId,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
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
	({ service }: PricelistServiceItemProps) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const descriptionId = useId();
		const readLessLabel = t("app.common.read_less@@Read Less");
		const readMoreLabel = t("app.common.read_more@@Read More");

		return (
			<article class="card card-sm border border-base-content/12 bg-base-100 shadow-sm">
				<div class="card-body gap-3 px-4 py-4 md:px-6 md:py-5">
					{/* Header Row: Title --- Price */}
					<div class="flex flex-col gap-1.5 md:flex-row md:items-baseline md:justify-between md:gap-0">
						<div class="flex min-w-0 grow items-baseline">
							<h3 class="pr-3 font-montserrat text-base leading-snug font-semibold text-base-content md:pr-4 md:text-lg">
								{service.name}
							</h3>
							<div class="relative -top-1.5 mx-2 hidden min-w-5 grow border-b border-dotted border-base-content/25 md:block" />
						</div>
						<span class="badge badge-primary badge-lg self-end shrink-0 font-montserrat font-semibold text-primary-content md:self-auto">
							{formatPremiumPrice(service.price)}
						</span>
					</div>

					{/* Description with expand/collapse on mobile */}
					<div class="mb-2">
						<p
							id={descriptionId}
							class={`max-w-4xl font-montserrat text-sm leading-6 text-base-content/85 md:text-base md:leading-7 ${isExpanded.value ? "" : "line-clamp-2 md:line-clamp-none"}`}
						>
							{service.description}
						</p>
						{service.description && service.description.length > 100 && (
							<button
								type="button"
								onClick$={$(() => {
									isExpanded.value = !isExpanded.value;
								})}
								class="btn btn-ghost btn-sm mt-1 min-h-11 px-0 font-montserrat text-xs text-primary md:hidden"
								aria-expanded={isExpanded.value}
								aria-controls={descriptionId}
							>
								{isExpanded.value ? readLessLabel : readMoreLabel}
							</button>
						)}
					</div>

					{/* Meta: Duration */}
					{service.duration && (
						<div class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-base-content/75">
							<span class="badge badge-outline badge-sm h-auto min-h-8 gap-2 border-base-content/25 px-3 text-base-content/75">
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
								<span class="ml-2">
									{service.duration}&nbsp;{t("app.services.minutes@@min")}
								</span>
							</span>
						</div>
					)}
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
				<section class="hero relative min-h-96 overflow-hidden bg-base-200 pt-16 md:min-h-128 md:pt-20">
					<div class="absolute inset-0">
						<ImgPricelistHero
							alt={t(
								"app.pricelist.hero_alt@@Aesthetic Lab treatment catalog background",
							)}
							class="h-full w-full object-cover opacity-85"
							loading="eager"
							fetchPriority="high"
						/>
						<div class="hero-overlay absolute inset-0 bg-base-200/40" />
					</div>
					<div class="hero-content relative z-10 w-full max-w-7xl justify-center px-4 py-12 md:px-8 md:py-16 opacity-95">
						<div class="mx-auto w-full max-w-xl">
							<div class="surface-card bg-base-100/90 px-6 py-7 text-center text-base-content md:px-9 md:py-8">
								<h1 class="font-qestero text-4xl leading-tight md:text-5xl">
									{t("app.services.pricing_title@@Services & Pricing")}
								</h1>
								<div class="mx-auto my-4 h-px w-16 bg-primary/40 md:my-5" />
								<p class="mx-auto max-w-lg font-montserrat text-sm leading-6 text-base-content/85 md:text-base md:leading-7">
									{t(
										"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
									)}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Pricing List */}
				<section class="section-shell border-y border-base-300/30 bg-base-200">
					<div class="custom-container mx-auto max-w-6xl">
						{groupedServices.length > 1 ? (
							<nav
								class="card surface-card sticky top-16 z-20 -mx-1 mb-8 bg-base-100/98 p-2 shadow-md md:top-20 md:mb-12 md:rounded-2xl md:p-3"
								aria-label={categoryNavLabel}
							>
								<div class="scrollbar-none flex snap-x gap-2 overflow-x-auto overscroll-x-contain">
									{groupedServices.map(
										({ groupId, displayCategoryName, anchorId }, index) => (
											<a
												key={groupId}
												href={`#${anchorId}`}
												class="btn btn-outline btn-primary btn-sm min-h-11 shrink-0 snap-start rounded-full font-montserrat uppercase tracking-wider"
											>
												<span class="text-primary/60">
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
												class="card surface-card scroll-mt-36 shadow-md"
											>
												<div class="card-body gap-0 p-4 md:p-8">
													<div class="mb-6 flex flex-col gap-4 md:mb-8">
														<div class="flex items-center gap-4">
															<span class="badge badge-primary badge-lg size-11 shrink-0 rounded-full p-0 font-montserrat text-xs font-semibold tracking-[0.12em] md:size-12">
																{getCategoryNumber(index)}
															</span>
															<div class="h-px flex-1 bg-base-300/50" />
															{startingPriceLabel ? (
																<span class="badge badge-primary badge-outline shrink-0 rounded-full font-montserrat">
																	{startingPriceLabel}
																</span>
															) : null}
														</div>
														<div>
															<p class="font-montserrat text-xs uppercase tracking-[0.2em] text-base-content/65 md:tracking-[0.24em]">
																{categoryLabel}
															</p>
															<h2 class="font-qestero text-3xl text-base-content md:text-4xl">
																{displayCategoryName}
															</h2>
														</div>
													</div>

													<div class="space-y-3 md:space-y-4">
														{groupServices.map((service) => (
															<PricelistServiceItem
																key={service.id}
																service={service}
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
				<section class="bg-base-100 px-4 py-16 text-center md:py-24">
					<FadeUp class="card surface-card mx-auto max-w-3xl bg-base-200/35">
						<div class="card-body items-center px-5 py-10 md:p-14">
							<p class="editorial-kicker mb-4">
								{t("app.pricelist.ready@@Ready when you are")}
							</p>
							<h2 class="section-heading mb-6">
								{t("app.hero.book_visit@@Book Your Visit")}
							</h2>
							<Booking
								id="bottom_pricelist_book"
								text={t("app.hero.book_appointment@@Book Appointment")}
								location={contact?.location.name || ""}
								classes="btn btn-primary btn-md h-12 min-h-12 rounded-full px-8 font-montserrat uppercase tracking-[0.12em] text-primary-content"
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
