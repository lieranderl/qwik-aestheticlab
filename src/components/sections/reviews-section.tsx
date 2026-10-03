import { $, component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { KickerLabel } from "~/components/ui/kicker-label";
import { StarRating } from "~/components/ui/star-rating";
import { googlePlaceUrl, googleRating, googleReviewCount } from "~/consts";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

/**
 * Kind words: the Google rating with a link to read every review on Google.
 */
export const ReviewsSection = component$(() => {
	const t = inlineTranslate();
	const reviewCountLabel = t(
		"app.hero.google_reviews@@{{count}} Google reviews",
		{ count: googleReviewCount },
	);

	const trackGoogleLink = $(() => {
		trackGoogleAnalyticsEvent("google_reviews_clicked", {
			placement: "reviews_section",
			link_url: googlePlaceUrl,
		});
	});

	return (
		<section
			id="reviews"
			aria-labelledby="reviews-title"
			class="scroll-mt-24 bg-sage-200 px-4 py-14 text-ink sm:px-6 md:py-20 lg:px-8"
		>
			<div class="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
				<div class="flex flex-col gap-4 md:gap-5">
					<FadeUp>
						<KickerLabel class="mb-0">
							{t("app.reviews.kicker@@Kind words")}
						</KickerLabel>
					</FadeUp>
					<FadeUp mask>
						<h2
							id="reviews-title"
							class="font-cormorant text-[2.75rem] leading-[0.92] font-medium tracking-[-0.015em] md:text-6xl lg:text-7xl"
						>
							{t("app.reviews.section_title@@What people say")}
						</h2>
					</FadeUp>
					<FadeUp delay={100}>
						<p class="max-w-xl font-main text-base leading-relaxed text-sage-700 md:text-lg">
							{t(
								"app.reviews.tagline@@Sterile tools · Lasting results · A calm, friendly studio",
							)}
						</p>
					</FadeUp>
				</div>

				<FadeUp delay={200}>
					<a
						href={googlePlaceUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick$={trackGoogleLink}
						aria-label={`${googleRating} · ${reviewCountLabel} — ${t("app.reviews.google_link@@Read all reviews on Google")}`}
						class="group flex flex-col gap-4 border-t border-ink pt-5 md:min-w-80"
					>
						<span class="flex items-end gap-4">
							<span class="font-cormorant text-[5.5rem] leading-[0.8] tracking-[-0.02em] md:text-[7rem]">
								{googleRating}
							</span>
							<span class="flex flex-col gap-2 pb-1 font-main text-sm font-semibold">
								<StarRating rating={5} />
								{reviewCountLabel}
							</span>
						</span>
						<span class="inline-flex min-h-11 items-center gap-2.5 font-main text-[0.9375rem] font-semibold text-rosewood">
							{t("app.reviews.google_link@@Read all reviews on Google")}
							<span
								aria-hidden="true"
								class="transition-transform duration-500 ease-(--ease-quint) group-hover:translate-x-1.5"
							>
								→
							</span>
						</span>
					</a>
				</FadeUp>
			</div>
		</section>
	);
});
