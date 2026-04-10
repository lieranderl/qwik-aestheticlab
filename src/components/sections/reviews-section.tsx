import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";

interface Review {
	author: string;
	rating: number;
	text: string;
	date?: string;
}

export const ReviewsSection = component$(() => {
	const t = inlineTranslate();
	const scrollerRef = useSignal<HTMLDivElement>();

	// Extracted from Google Maps
	const reviews: Review[] = [
		{
			author: "Polina Kiper",
			rating: 5,
			text: "The best nail salon in Leuven! I highly recommend it to anyone who values top-notch quality, a clean and hygienic environment, and a team that truly focuses on the customer. I’d been searching for years for a place I could fully trust... I can’t wait to see what’s next!",
			date: "3 weeks ago",
		},
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
	];

	// Infinite scroll animation duplication
	const allReviews = [...reviews, ...reviews];

	// eslint-disable-next-line qwik/no-use-visible-task
	useTask$(() => {
		if (typeof window !== "undefined") {
			const scroller = scrollerRef.value;
			if (!scroller) return;

			// Simple auto-scroll logic or just leave it to CSS animation
			// Using CSS animation is smoother.
		}
	});

	return (
		<section class="py-24 bg-base-200 overflow-hidden relative">
			<div class="custom-container mb-12 text-center">
				<FadeUp>
					<h2 class="font-qestero text-4xl md:text-5xl  mb-4">
						{t("app.reviews.title@@Kind Words")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary mb-6" />
					<div class="flex items-center justify-center gap-2 mb-2">
						{/* 5 Stars SVG */}
						{/* 5 Stars DaisyUI */}
						<div class="rating rating-md gap-1">
							{[1, 2, 3, 4, 5].map((i) => (
								<input
									key={i}
									type="radio"
									name="rating-header"
									class="mask mask-star-2 bg-warning"
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
				</FadeUp>
			</div>

			{/* Marquee Container */}
			<div class="relative w-full overflow-hidden">
				{/* Gradients to fade edges */}
				<div class="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-linear-to-r from-base-100 to-transparent z-10 pointer-events-none" />
				<div class="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-linear-to-l from-base-100 to-transparent z-10 pointer-events-none" />

				{/* Scrolling Track */}
				<div
					class="flex gap-6 md:gap-8 w-max animate-scroll"
					style={{
						"--scroll-duration": "60s",
					}}
				>
					{allReviews.map((review, index) => (
						<div
							key={`${review.author}-${index}`}
							class="w-[300px] md:w-[400px] bg-base-100 p-8 rounded-2xl shadow-sm border border-base-200 flex flex-col justify-between shrink-0"
						>
							<div>
								<div class="rating rating-sm gap-0.5 mb-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<input
											key={i}
											type="radio"
											name={`rating-${index}`}
											class="mask mask-star-2 bg-warning"
											checked
											disabled
										/>
									))}
								</div>
								<p class="font-montserrat text-sm  leading-relaxed italic line-clamp-6">
									"{review.text}"
								</p>
							</div>
							<div class="mt-6 flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-qestero text-primary font-bold">
									{review.author.charAt(0)}
								</div>
								<div>
									<p class="font-montserrat font-semibold text-sm">
										{review.author}
									</p>
									<p class="text-xs text-base-content/60">Google Review</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<style>{`
          @keyframes scroll {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
          }
          .animate-scroll {
             animation: scroll 60s linear infinite;
          }
          .animate-scroll:hover {
             animation-play-state: paused;
          }
       `}</style>
		</section>
	);
});
