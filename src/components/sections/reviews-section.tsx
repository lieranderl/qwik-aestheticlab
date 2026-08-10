import { $, component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { KickerLabel } from "~/components/ui/kicker-label";
import { StarRating } from "~/components/ui/star-rating";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

interface Review {
	author: string;
	rating: number;
	text: string;
}

const ALL_REVIEWS: Review[] = [
	{
		author: "Polina Kiper",
		rating: 5,
		text: "The best nail salon in Leuven! I highly recommend it to anyone who values top-notch quality, a clean and hygienic environment, and a team that truly focuses on the customer. I'd been searching for years for a place I could fully trust, and then I found Rubina, my nail master. Together with her sister, she's created this amazing salon, working tirelessly to make every customer happy and satisfied with the results. They offer a fantastic variety of products and colors, pay incredible attention to detail, and even have lovely perks for loyal customers. I'm excited to see the salon expanding into other services like laser treatments—I can't wait to see what's next!",
	},
	{
		author: "Tanka T'Sjoen",
		rating: 5,
		text: "I love this studio! Perfect nails that hold very long. The beauticians are very professional and take their time to finish their work. The atmosphere is incredibly friendly and I always feel very welcome.\nI can only recommend this place 💕",
	},
	{
		author: "Anna Honcharenko",
		rating: 5,
		text: "Great experience with laser hair removal! The staff were professional and very friendly, the procedure was quick and comfortable. The salon is clean and modern, and I'm very happy with the results. Highly recommend!",
	},
	{
		author: "Elena Tiukhova",
		rating: 5,
		text: "Great manicure! Accurate, fast, sterile and long lasting. Zara is amazing ❤️",
	},
	{
		author: "Михаела Матвійчук",
		rating: 5,
		text: "Amazing nail studio! The atmosphere is clean, cozy, and very professional. The master is extremely skilled, attentive to details, and really listens to what you want. My nails look perfect and last beautifully. I'm very happy with the result and will definitely come back.",
	},
	{
		author: "Nadia Shutova",
		rating: 5,
		text: "Favorite nail salon in the city - high quality in every detail (sterile tools, a perfect gel polish that lasts a full 3 weeks, and the nail tech always chooses the right strengthening based on your lifestyle and nail type). Easy booking, central location and a lovely atmosphere.",
	},
	{
		author: "Julia Lavrentieva",
		rating: 5,
		text: "Love being here as I always get perfect quality of my nails and service in general. I have an issue with scratching skin on my fingers, and Zara always takes care of it by gentle polishing, I see that all tools are sterile… My manicure stays perfect for weeks. Totally recommend!",
	},
	{
		author: "Brendon Wall",
		rating: 5,
		text: "Had a men's manicure here. Clean, professional and very relaxed. Great attention to detail and my hands look neat without being overdone. Will definitely come back.",
	},
	{
		author: "Melisa Jiranová",
		rating: 5,
		text: "Top-notch hygiene, speed and precision of the service and pleasant staff. Prices are a bit higher, but I understand why, because the service matches them. I definitely recommend this salon!",
	},
	{
		author: "Yevheniia Maksymenko",
		rating: 5,
		text: "I had a wonderful experience! The manicure is always done perfectly, with great attention to detail. I really appreciate how clean and well-maintained the tools are - it makes me feel completely comfortable and confident.\n\nThe staff are incredibly attentive and professional, always making sure everything is just right. And the delicious coffee they offer is such a lovely touch that makes each visit even more enjoyable.\n\nHighly recommended!😍",
	},
	{
		author: "Виктория Васильева",
		rating: 5,
		text: "I've been coming to this nail studio in Leuven for a long time, and I'm always happy with the results. Zara is professional, talented, and pays great attention to detail. The service is always excellent, and my nails look perfect every time. Highly recommended!",
	},
	{
		author: "Diana Richardson",
		rating: 5,
		text: "Excellent service and great place! Julia is an extremely talented professional and I'm very happy with the results!",
	},
	{
		author: "Ирен Ирен",
		rating: 5,
		text: "I got my nails done by Rubina and was very pleased with the results! The work was done quickly and carefully, everything was sterile and professional. My manicure turned out absolutely perfect. Thank you so much, I'll definitely be back again.",
	},
];

function shuffle<T>(arr: readonly T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export const ReviewsSection = component$(() => {
	const t = inlineTranslate();
	const reviews = useSignal<Review[]>(shuffle([...ALL_REVIEWS]));

	return (
		<section
			id="reviews"
			class="relative scroll-mt-24 overflow-hidden bg-base-100 py-16 md:py-24 lg:py-28"
		>
			<div class="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 md:gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-8">
				<header>
					<KickerLabel>{t("app.reviews.kicker@@Loved in Leuven")}</KickerLabel>
					<h2 class="text-balance font-cormorant text-5xl leading-[0.9] text-base-content md:text-6xl lg:text-7xl">
						{t("app.reviews.section_title@@Kind words")}
					</h2>
					<div class="stats mt-8 w-full rounded-none border-t border-base-300 bg-transparent shadow-none">
						<div class="stat px-0 pt-5 pb-0">
							<div class="stat-value font-cormorant text-5xl font-normal leading-none text-base-content motion-safe:animate-bounce-in motion-reduce:animate-none motion-reduce:opacity-100">
								5.0
							</div>
							<div class="stat-desc mt-2">
								<StarRating rating={5} />
							</div>
						</div>
					</div>
					<a
						href="https://maps.app.goo.gl/bsdNssGY4YTJeR7j6"
						target="_blank"
						rel="noopener noreferrer"
						onClick$={$(() => {
							trackGoogleAnalyticsEvent("google_reviews_clicked", {
								placement: "reviews_section",
								link_url: "https://maps.app.goo.gl/bsdNssGY4YTJeR7j6",
							});
						})}
						class="link link-hover mt-5 inline-flex min-h-11 items-center font-main text-sm font-medium text-secondary"
					>
						{t("app.reviews.google_link@@Read all reviews on Google")}
					</a>
				</header>

				<section
					class="carousel -mx-4 w-[calc(100%+2rem)] max-w-[calc(100%+2rem)] scroll-smooth snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:w-[calc(100%+3rem)] sm:max-w-[calc(100%+3rem)] sm:gap-5 sm:px-6 lg:mx-0 lg:w-full lg:max-w-full lg:overflow-x-auto lg:gap-5 lg:px-0"
					aria-label={t("app.reviews.section_title@@Kind words")}
				>
					{reviews.value.map((review, index) => (
						<article
							key={`${review.author}-${index}`}
							class="carousel-item card card-border min-h-88 min-w-0 w-[min(20rem,calc(100vw-3rem))] shrink-0 snap-start overflow-hidden bg-base-100 transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg sm:w-100 lg:w-md"
						>
							<div class="card-body min-w-0 justify-between gap-8 p-6 md:p-8">
								<div class="min-w-0">
									<div class="mb-8 flex items-start justify-between border-b border-base-300 pb-4">
										<StarRating rating={review.rating} />
										<span class="font-main text-[0.65rem] font-semibold tracking-[0.18em] text-base-content">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
									<blockquote class="line-clamp-7 whitespace-pre-line text-pretty font-main text-base font-medium leading-7 tracking-[-0.01em] text-base-content/90 md:text-[1.0625rem] md:leading-8">
										"{review.text}"
									</blockquote>
								</div>
								<div class="flex min-w-0 items-center gap-3">
									<div aria-hidden="true" class="avatar avatar-placeholder">
										<div class="w-10 rounded-full bg-base-300 text-base-content">
											<span class="font-cormorant font-bold">
												{review.author.charAt(0)}
											</span>
										</div>
									</div>
									<div class="min-w-0">
										<p class="wrap-break-word font-main text-sm font-semibold text-base-content">
											{review.author}
										</p>
										<p class="text-xs text-base-content">
											{t("app.reviews.source@@Google Review")}
										</p>
									</div>
								</div>
							</div>
						</article>
					))}
				</section>
				<div aria-hidden="true" class="mt-3 flex items-center gap-3">
					<span class="h-px grow bg-base-300" />
					<span class="font-main text-[0.65rem] font-semibold tracking-[0.18em] text-base-content">
						01 — {String(reviews.value.length).padStart(2, "0")}
					</span>
				</div>
			</div>
		</section>
	);
});
