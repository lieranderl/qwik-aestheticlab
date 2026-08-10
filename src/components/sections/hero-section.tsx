import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { RotatingText, ScrollDownHint } from "~/components/ui/rotating-text";
import BirdLogo from "~/media/Bird.svg?jsx";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section
			id="hero"
			class="hero relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-primary pt-[calc(env(safe-area-inset-top)+5.25rem)] pb-20 md:pt-[calc(env(safe-area-inset-top)+6.5rem)] md:pb-24"
		>
			<div class="hero-content flex flex-col items-center gap-8 text-center md:gap-14">
				<h1 class="max-w-none font-cormorant text-3xl leading-[1.1] font-normal italic whitespace-nowrap text-primary-content/80 md:text-5xl lg:text-6xl">
					{t("app.hero.slogan@@The Art of Natural Beauty")}
				</h1>

				<div class="flex flex-col items-center gap-0 py-10 md:py-14">
					<BirdLogo class="h-auto w-32 text-white [&_path]:fill-current md:w-40" />
					<span class="font-qestero text-4xl leading-none tracking-wide text-white md:text-5xl">
						Aesthetic Lab
					</span>
				</div>

				<RotatingText />

				<div>
					<Booking
						id="hero-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						classes="btn btn-neutral btn-lg min-h-12 px-8 font-main text-xs font-semibold uppercase tracking-[0.12em] transition-shadow duration-200 motion-safe:hover:shadow-lg"
						analyticsPlacement="hero"
					/>
				</div>
			</div>

			<ScrollDownHint />
		</section>
	);
});
