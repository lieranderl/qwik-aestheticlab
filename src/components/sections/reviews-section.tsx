import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";

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
		<section class="py-24 bg-base-100 overflow-hidden relative">
			{/* Background Grain/Noise is global now */}

			<div class="custom-container mb-12 text-center">
				<FadeUp>
					<h2 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
						{t("app.reviews.title@@Kind Words")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary mb-6" />
					<div class="flex items-center justify-center gap-2 mb-2">
						{/* 5 Stars SVG */}
						<div class="flex text-warning">
							{[1, 2, 3, 4, 5].map((i) => (
								<svg
									key={i}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-6 h-6"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
										clip-rule="evenodd"
									/>
								</svg>
							))}
						</div>
						<span class="font-montserrat font-medium text-base-content">
							5.0
						</span>
					</div>
					<a
						href="https://maps.app.goo.gl/bsdNssGY4YTJeR7j6"
						target="_blank"
						rel="noreferrer"
						class="text-sm font-montserrat text-neutral-content hover:text-primary underline underline-offset-4"
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
							class="w-[300px] md:w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-base-200 flex flex-col justify-between shrink-0"
						>
							<div>
								<div class="flex text-warning mb-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<svg
											key={i}
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
											aria-hidden="true"
										>
											<path
												fill-rule="evenodd"
												d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
												clip-rule="evenodd"
											/>
										</svg>
									))}
								</div>
								<p class="font-montserrat text-sm text-neutral-content leading-relaxed italic line-clamp-6">
									"{review.text}"
								</p>
							</div>
							<div class="mt-6 flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-qestero text-primary font-bold">
									{review.author.charAt(0)}
								</div>
								<div>
									<p class="font-montserrat font-semibold text-sm text-base-content">
										{review.author}
									</p>
									<p class="text-xs text-neutral-content/60">Google Review</p>
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
