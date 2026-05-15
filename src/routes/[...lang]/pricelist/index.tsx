import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Footer } from "~/components/sections/footer";
import { Navigation } from "~/components/sections/navigation";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { formatPrice } from "~/consts";
import ImgPricelistHero from "~/media/pricelist-hero.png?jsx";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import type { Service } from "~/types";
import {
	useContactLoader,
	useServiceGroupsLoader,
	useServicesLoader,
} from "../layout";

interface PricelistServiceItemProps {
	service: Service;
}

function formatPremiumPrice(price: number) {
	const formattedPrice = formatPrice(price).replace(/\u00a0/g, " ");
	const amount = formattedPrice.replace(/\s*€$/, "");
	const englishAmount = amount.replace(/\./g, ",").replace(/,(\d{2})$/, ".$1");
	return `€${englishAmount}`;
}

function getStartingPriceLabel(groupServices: Service[], fromLabel: string) {
	if (groupServices.length === 0) return undefined;
	const startingPrice = Math.min(
		...groupServices.map((service) => service.price),
	);
	return `${fromLabel} ${formatPremiumPrice(startingPrice)}`;
}

function getDisplayCategoryName(categoryName: string) {
	const displayCategoryName =
		categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

	if (displayCategoryName === "Brows") {
		return "Brows & Lashes";
	}

	return displayCategoryName;
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
		const readLessLabel = t("app.common.read_less@@Read Less");
		const readMoreLabel = t("app.common.read_more@@Read More");

		return (
			<div class="group rounded-2xl px-3.5 md:px-6 py-3.5 md:py-5 bg-base-100/60">
				{/* Header Row: Title --- Price */}
				<div class="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1.5 md:mb-2 gap-1.5 md:gap-0">
					<div class="flex items-baseline grow min-w-0">
						<h3 class="font-qestero font-semibold tracking-wide text-base md:text-2xl text-base-content pr-3 md:pr-4">
							{service.name.charAt(0).toUpperCase() + service.name.slice(1)}
						</h3>
						<div class="hidden md:block grow border-b border-dotted border-base-200 mx-2 relative -top-1.5 opacity-70 min-w-5"></div>
					</div>
					<span class="font-montserrat text-xs md:text-base font-semibold shrink-0 md:pl-4 self-end md:self-auto bg-base-200/40 text-base-content rounded-full px-3 md:px-4 py-1">
						{formatPremiumPrice(service.price)}
					</span>
				</div>

				{/* Description with expand/collapse on mobile */}
				<div class="mb-2">
					<p
						class={`font-montserrat text-xs md:text-sm text-base-content/80 max-w-2xl ${isExpanded.value ? "" : "line-clamp-2 md:line-clamp-none"}`}
					>
						{service.description}
					</p>
					{service.description && service.description.length > 100 && (
						<button
							type="button"
							onClick$={$(() => {
								isExpanded.value = !isExpanded.value;
							})}
							class="md:hidden text-[10px] text-primary font-medium mt-1 hover:underline"
						>
							{isExpanded.value ? readLessLabel : readMoreLabel}
						</button>
					)}
				</div>

				{/* Meta: Duration */}
				{service.duration && (
					<div class="flex items-center gap-2 text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">
						<span class="inline-flex items-center justify-center h-6 md:h-7 px-2.5 md:px-3 rounded-full bg-primary/10 text-primary">
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
								{service.duration} {t("app.services.minutes@@min")}
							</span>
						</span>
					</div>
				)}
			</div>
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
			const displayCategoryName = getDisplayCategoryName(
				category?.name || defaultCategoryLabel,
			);
			return {
				groupId,
				groupServices: sortedServices,
				category,
				priority: category?.priority ?? 0,
				displayCategoryName,
				anchorId: getCategoryAnchorId(groupId),
				startingPriceLabel: getStartingPriceLabel(
					sortedServices,
					fromPriceLabel,
				),
			};
		})
		.sort((a, b) => b.priority - a.priority);
	return (
		<div class="min-h-screen">
			<Navigation />

			<main>
				{/* Hero */}
				<div class="relative h-[42vh] md:h-[48vh] min-h-96 md:min-h-120 flex items-center justify-center overflow-hidden">
					<div class="absolute inset-0">
						<ImgPricelistHero
							alt="Services Background"
							class="h-full w-full object-cover brightness-[0.85] saturate-90"
						/>
						<div class="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/60" />
					</div>
					<div class="relative z-10 text-center p-5 md:p-6 text-white max-w-2xl">
						<FadeUp>
							<div class="inline-flex items-center gap-2 bg-base-100/10 border border-white/20 rounded-full px-3 md:px-4 py-1 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em]">
								<span class="h-2 w-2 rounded-full bg-primary" />
								Aesthetic Lab
							</div>
							<h1 class="font-qestero text-3xl md:text-6xl mt-4 md:mt-6 mb-3 md:mb-4 leading-tight">
								{t("app.services.pricing_title@@Services & Pricing")}
							</h1>
							<p class="font-montserrat text-sm md:text-lg max-w-xl mx-auto opacity-90">
								{t(
									"app.services.subtitle@@Comprehensive beauty treatments delivered with precision and care.",
								)}
							</p>
						</FadeUp>
					</div>
				</div>

				{/* Pricing List */}
				<div class="custom-container py-14 md:py-24 max-w-6xl mx-auto">
					{groupedServices.length > 1 ? (
						<nav
							class="sticky top-18 md:top-20 z-20 -mx-4 mb-12 border-y border-base-300/40 bg-base-100/90 px-4 py-3 backdrop-blur-md md:rounded-full md:border md:px-5"
							aria-label={categoryNavLabel}
						>
							<div class="flex gap-2 overflow-x-auto pb-1">
								{groupedServices.map(
									({ groupId, displayCategoryName, anchorId }, index) => (
										<a
											key={groupId}
											href={`#${anchorId}`}
											class="btn btn-outline btn-primary btn-xs md:btn-sm shrink-0 rounded-full font-montserrat uppercase tracking-wider"
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

					<div class="space-y-20">
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
									<FadeUp key={groupId} delay={index * 100}>
										<section id={anchorId} class="scroll-mt-36">
											<div class="mb-6 flex flex-col gap-4 md:mb-8">
												<div class="flex items-center gap-4">
													<span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-base-100 font-montserrat text-xs font-semibold tracking-[0.18em] text-primary shadow-sm md:h-12 md:w-12">
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
													<p class="font-montserrat text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-base-content/60">
														{categoryLabel}
													</p>
													<h2 class="font-qestero text-xl md:text-4xl text-base-content">
														{displayCategoryName}
													</h2>
												</div>
											</div>

											<div class="bg-base-100 rounded-3xl p-4 md:p-10 shadow-sm border border-base-200 space-y-4 md:space-y-8">
												{groupServices.map((service) => (
													<PricelistServiceItem
														key={service.id}
														service={service}
													/>
												))}
											</div>
										</section>
									</FadeUp>
								);
							},
						)}
					</div>
				</div>

				{/* CTO Bottom */}
				<section class="py-24 bg-base-100 text-center border-t border-base-200">
					<FadeUp>
						<h2 class="font-qestero text-4xl mb-6">
							{t("app.hero.book_visit@@Book Your Visit")}
						</h2>
						<Booking
							id="bottom_pricelist_book"
							text={t("app.hero.book_appointment@@Book Appointment")}
							location={contact?.location.name || ""}
							classes="btn btn-primary text-white rounded-full px-10 py-3 text-lg"
							analyticsPlacement="pricelist_bottom"
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
