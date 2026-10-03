import { $, component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { InViewVideo, VideoControl } from "~/components/ui/in-view-video";
import { KickerLabel } from "~/components/ui/kicker-label";
import { Parallax } from "~/components/ui/parallax";
import { googlePlaceUrl, googleRating, googleReviewCount } from "~/consts";
import heroVideo from "~/media/video/reset.mp4?url";
import heroPoster from "~/media/video/reset-poster.jpg?url";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const HeroSection = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();
	const ratingLabel = `★★★★★ ${googleRating} · ${t(
		"app.hero.google_reviews@@{{count}} Google reviews",
		{ count: googleReviewCount },
	)}`;
	const slogan = t("app.hero.slogan@@The art of natural beauty");

	const trackRating = $(() => {
		trackGoogleAnalyticsEvent("google_reviews_clicked", {
			placement: "hero",
			link_url: googlePlaceUrl,
		});
	});

	return (
		<section
			id="hero"
			class="relative isolate grid min-h-svh overflow-hidden bg-sage-200 lg:min-h-[max(46rem,100svh)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24 lg:bg-primary lg:px-[max(2.5rem,calc((100vw-82.5rem)/2+3.5rem))] lg:pt-28 lg:pb-20"
		>
			{/* Media: full screen behind the text on phones, a fixed frame on desktop.
			    It only slides; its size never changes. */}
			<div class="absolute inset-0 -z-10 overflow-hidden bg-sage-200 lg:relative lg:inset-auto lg:z-auto lg:order-2 lg:bg-sage-500">
				<Parallax
					mode="top"
					speed={0.25}
					class="h-full lg:absolute lg:inset-x-0 lg:-top-20 lg:h-[calc(100%+5rem)]"
				>
					<InViewVideo
						id="hero-video"
						src={heroVideo}
						poster={heroPoster}
						preload="auto"
						label={t(
							"app.hero.video_label@@Pink gel manicure being washed with soft foam",
						)}
						class="-ml-15 block h-full w-[calc(100%+3.75rem)] max-w-none object-cover motion-safe:animate-media-slide"
					/>
				</Parallax>
			</div>
			{/* Above the text layer, so it stays reachable on phones too. */}
			<VideoControl
				videoId="hero-video"
				class="absolute top-[calc(env(safe-area-inset-top)+4.75rem)] right-4 z-10 lg:top-auto lg:right-[calc(max(2.5rem,calc((100vw-82.5rem)/2+3.5rem))+1rem)] lg:bottom-24"
			/>
			{/* Phones: a light fade keeps the dark text readable on the pale video. */}
			<div
				aria-hidden="true"
				class="absolute inset-x-0 top-0 -z-10 h-36 bg-linear-to-b from-linen/85 to-transparent lg:hidden"
			/>
			<div
				aria-hidden="true"
				class="absolute inset-x-0 bottom-0 -z-10 h-[72%] bg-linear-to-t from-sage-200 from-45% via-sage-200/85 via-70% to-transparent lg:hidden"
			/>

			<div class="flex flex-col justify-end text-ink">
				<Parallax
					mode="fade"
					fadeOutOver={420}
					class="flex flex-col gap-4.5 px-6 pt-28 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] lg:gap-7 lg:px-0 lg:pt-0 lg:pb-3"
				>
					<div class="motion-safe:animate-fade-rise [animation-delay:80ms]">
						<KickerLabel tone="sage" class="mb-0">
							{t("app.hero.kicker@@Leuven · since 2024")}
						</KickerLabel>
					</div>

					<h1 class="overflow-clip pb-[0.06em] font-cormorant text-[3.75rem] max-[360px]:text-5xl leading-[0.9] font-medium tracking-[-0.02em] text-balance sm:text-7xl lg:text-[clamp(4rem,5.6vw,6rem)]">
						<span class="block motion-safe:animate-line-up [animation-delay:160ms]">
							{slogan}
						</span>
					</h1>

					<p class="max-w-[30rem] font-main text-[0.9375rem] [@media(max-height:620px)]:max-lg:hidden leading-relaxed motion-safe:animate-fade-rise [animation-delay:500ms] lg:text-lg">
						{t(
							"app.hero.lead@@Manicure, pedicure, brows, lashes and laser, in a calm studio in the heart of Leuven.",
						)}
					</p>

					<div class="flex flex-col gap-3 motion-safe:animate-fade-rise [animation-delay:600ms] lg:flex-row lg:items-center lg:gap-7">
						<Booking
							id="hero-book-btn"
							text={t("app.book.book_app@@Book Appointment")}
							classes="btn btn-neutral h-13.5 min-h-13.5 px-8 font-main text-[0.9375rem] font-semibold lg:h-14 lg:min-h-14"
							analyticsPlacement="hero"
						/>
						<a
							href={getLocaleNavLink(location.url.pathname, "pricelist")}
							class="group inline-flex min-h-11 items-center justify-center gap-2.5 font-main text-[0.9375rem] font-semibold"
							onClick$={$(() => {
								trackGoogleAnalyticsEvent("pricing_link_clicked", {
									placement: "hero",
								});
							})}
						>
							{t("app.hero.see_prices@@See prices")}
							<span
								aria-hidden="true"
								class="transition-transform duration-500 ease-(--ease-quint) group-hover:translate-x-1.5"
							>
								→
							</span>
						</a>
					</div>

					<a
						href={googlePlaceUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick$={trackRating}
						class="inline-flex min-h-11 items-center justify-center font-main text-sm font-medium motion-safe:animate-fade-rise [animation-delay:700ms] hover:underline lg:justify-start lg:border-t lg:border-ink/30 lg:pt-5"
					>
						{ratingLabel}
					</a>
				</Parallax>
			</div>
		</section>
	);
});
