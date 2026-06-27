import {
	$,
	component$,
	useSignal,
	useStyles$,
	useVisibleTask$,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

const marqueeStyles = `
@keyframes reviews-scroll {
	0% { transform: translateX(0); }
	100% { transform: translateX(-50%); }
}

.reviews-animate-scroll {
	animation: reviews-scroll var(--scroll-duration, 60s) linear infinite;
}

.reviews-animate-scroll:hover,
.reviews-animate-scroll:focus-within {
	animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
	.reviews-animate-scroll {
		animation: none;
	}
}
`;

interface Review {
	author: string;
	rating: number;
	text: string;
	date?: string;
}

export const ReviewsSection = component$(() => {
	const t = inlineTranslate();
	useStyles$(marqueeStyles);

	// Extracted from Google Maps
	const reviews: Review[] = [
		{
			author: "Elena Matviichuk",
			rating: 5,
			text: "What a great experience at this salon! The staff is very professional and experienced, incredibly kind and friendly, and the atmosphere is relaxed and welcoming. I got an amazing manicure and pedicure, and the result truly exceeded my expectations. They also sterilize all their tools... I’ll definitely be coming back!",
			date: "1 month ago",
		},
		{
			author: "Михаела Матвійчук",
			rating: 5,
			text: "Amazing nail studio! The atmosphere is clean, cozy, and very professional. The master is extremely skilled, attentive to details, and really listens to what you want. My nails look flawless and last perfectly. I’m very happy with the result and will definitely come back.",
			date: "3 weeks ago",
		},
		{
			author: "Nadia Shutova",
			rating: 5,
			text: "Favorite nail salon in the city - high quality in every detail (sterile tools, a perfect gel polish that lasts a full 3 weeks, and the nail tech always chooses the right strengthening based on your lifestyle and nail type). Easy booking, central location, and such a lovely atmosphere.",
			date: "3 months ago",
		},
		{
			author: "Julia Lavrentieva",
			rating: 5,
			text: "Love being here as I always get perfect quality of my nails and service in general. Zara always takes care of my skin by gentle polishing, I see that all tools are sterile... I wear my manicure for weeks in perfect condition. Totally recommend!",
			date: "3 weeks ago",
		},
		{
			author: "Brendon Wall",
			rating: 5,
			text: "Had a men’s manicure here. Clean, professional and very relaxed. Great attention to detail and my hands look neat without being overdone. Will definitely come back.",
			date: "3 weeks ago",
		},
		{
			author: "Melisa Jiranová",
			rating: 5,
			text: "Top-notch hygiene, speed and precision of the service and pleasant staff. The prices are a bit higher, but I understand why, because the service matches them. I definitely recommend this salon!",
			date: "3 months ago",
		},
		{
			author: "Yevheniia Maksymenko",
			rating: 5,
			text: "I had a wonderful experience! The manicure is always done perfectly, with great attention to detail. I really appreciate how clean and well-maintained the tools are - it makes me feel completely comfortable and confident. The staff are incredibly attentive and professional, always making sure everything is just right. And the delicious coffee they offer is such a lovely touch that makes each visit even more enjoyable. Highly recommended!😍",
			date: "1 week ago",
		},
		{
			author: "Виктория Васильева",
			rating: 5,
			text: "I’ve been coming to this nail studio in Leuven for a long time, and I’m always happy with the results. Zara is professional, talented, and pays great attention to detail. The service is always excellent, and my nails look perfect every time. Highly recommended!",
			date: "2 weeks ago",
		},
		{
			author: "Елизавета Абхазава",
			rating: 5,
			text: "I had eyelash and eyebrow lamination with Yulia. The results were amazing. I thank Yulia for her work, her expertise, and the amazing results that make me want to look in the mirror more often. Definitely come and try it out!",
			date: "2 weeks ago",
		},
		{
			author: "Diana Richardson",
			rating: 5,
			text: "Excellent service and great place! Julia is an extremely talented professional and I'm very happy with the results!",
			date: "1 month ago",
		},
		{
			author: "Ирен Ирен",
			rating: 5,
			text: "I got my nails done by Rubina and was very pleased with the results! The work was done quickly and carefully, everything was sterile and professional. My manicure turned out absolutely perfect. Thank you so much, I'll definitely be back again.",
			date: "1 month ago",
		},
	];

	const shuffledReviews = useSignal<Review[]>(reviews);

	// biome-ignore lint/correctness/noQwikUseVisibleTask: Client-side randomization avoids SSR hydration mismatch
	useVisibleTask$(() => {
		shuffledReviews.value = [...reviews].sort(() => Math.random() - 0.5);
	});

	// Infinite scroll animation duplication
	const allReviews = [...shuffledReviews.value, ...shuffledReviews.value];

	return (
		<section class="relative overflow-hidden bg-base-200 py-16 md:py-24">
			<div class="custom-container mb-9 md:mb-12">
				<FadeUp class="grid gap-6 text-center md:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:text-left">
					<div>
						<p class="editorial-kicker mb-4">
							{t("app.reviews.kicker@@Client notes")}
						</p>
						<h2 class="font-qestero mb-4 text-4xl md:text-5xl">
							{t("app.reviews.title@@Kind Words")}
						</h2>
						<div class="editorial-rule mx-auto mb-6 w-20 lg:mx-0 lg:w-32" />
					</div>
					<div class="flex flex-col items-center gap-2 lg:items-end">
						<div class="flex items-center justify-center gap-2">
							<span class="sr-only">
								{t("app.reviews.rating_aria@@5 out of 5 stars")}
							</span>
							{/* 5 Stars SVG */}
							{/* 5 Stars DaisyUI */}
							<div class="rating rating-md gap-1" aria-hidden="true">
								{[1, 2, 3, 4, 5].map((i) => (
									<input
										key={i}
										type="radio"
										name="rating-header"
										class="mask mask-star-2 bg-warning"
										aria-label={`${i} star${i > 1 ? "s" : ""}`}
										checked
										disabled
									/>
								))}
							</div>
							<span class="font-montserrat font-medium">5.0</span>
						</div>
						<a
							href="https://maps.app.goo.gl/bsdNssGY4YTJeR7j6"
							target="_blank"
							rel="noreferrer"
							onClick$={$(() => {
								trackGoogleAnalyticsEvent("google_reviews_clicked", {
									placement: "reviews_section",
									link_url: "https://maps.app.goo.gl/bsdNssGY4YTJeR7j6",
								});
							})}
							class="link link-primary"
						>
							{t("app.reviews.google_link@@Read all reviews on Google")}
						</a>
					</div>
				</FadeUp>
			</div>

			{/* Marquee Container */}
			<div class="relative w-full overflow-hidden">
				{/* Gradients to fade edges */}
				<div class="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-linear-to-r from-base-200 to-transparent md:w-32" />
				<div class="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-linear-to-l from-base-200 to-transparent md:w-32" />

				{/* Scrolling Track */}
				<div
					class="reviews-animate-scroll flex w-max gap-4 md:gap-8"
					style={{
						"--scroll-duration": "95s",
					}}
				>
					{allReviews.map((review, index) => (
						<div
							key={`${review.author}-${index}`}
							class="flex w-[17rem] shrink-0 flex-col justify-between rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:w-[25rem] md:p-8"
						>
							<div>
								<span class="sr-only">
									{t("app.reviews.rating_aria@@5 out of 5 stars")}
								</span>
								<div
									class="rating rating-xs mb-3 gap-0.5 md:rating-sm md:mb-4"
									aria-hidden="true"
								>
									{[1, 2, 3, 4, 5].map((i) => (
										<input
											key={i}
											type="radio"
											name={`rating-${index}`}
											class="mask mask-star-2 bg-warning"
											aria-label={`${i} star${i > 1 ? "s" : ""}`}
											checked
											disabled
										/>
									))}
								</div>{" "}
								<p class="font-montserrat line-clamp-5 text-[0.82rem] leading-relaxed italic md:line-clamp-6 md:text-sm">
									"{review.text}"
								</p>
							</div>
							<div class="mt-4 flex items-center gap-3 md:mt-6">
								<div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-qestero font-bold text-primary md:h-10 md:w-10">
									{review.author.charAt(0)}
								</div>
								<div>
									<p class="font-montserrat text-sm font-semibold">
										{review.author}
									</p>
									<p class="text-xs text-base-content/80">Google Review</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
});
