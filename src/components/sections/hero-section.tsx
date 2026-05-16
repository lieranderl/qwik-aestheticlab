import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { RotatingText } from "~/components/ui/rotating-text";
import AestheticLabLogo from "~/media/AestheticLab.svg?jsx";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="relative flex min-h-[92svh] w-full items-center justify-center overflow-hidden bg-base-200 pt-[calc(env(safe-area-inset-top)+5.25rem)] pb-10 md:min-h-[92svh] md:pt-[calc(env(safe-area-inset-top)+6.5rem)] md:pb-16">
			<div class="custom-container relative z-10 flex flex-col items-center justify-center text-center">
				{/* Main Headline Group */}
				<div class="relative mb-8 flex flex-col items-center md:mb-12">
					<FadeUp delay={100} duration={1000} direction="down">
						<span class="font-montserrat mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-primary md:text-sm md:tracking-[0.2em]">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</span>
					</FadeUp>

					<FadeUp
						delay={300}
						duration={1200}
						class="mb-6 flex justify-center text-primary md:mb-8"
						direction="up"
						distance={28}
					>
						<AestheticLabLogo
							class="h-auto w-[78vw] max-w-[25rem] text-primary md:w-[54vw] md:max-w-[32rem]"
							aria-label="Aesthetic Lab"
						/>
					</FadeUp>

					<FadeUp delay={400} duration={1000} direction="up">
						<RotatingText />
					</FadeUp>
				</div>

				{/* Action Buttons */}
				<FadeUp
					delay={500}
					duration={1000}
					class="flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row"
					direction="up"
				>
					<Booking
						id="hero-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						location="372146"
						classes="inline-flex w-full justify-center sm:w-auto btn btn-primary btn-md md:btn-lg font-montserrat font-medium tracking-[0.16em] uppercase hover:-translate-y-1 transition-all duration-300"
						analyticsPlacement="hero"
					/>

					<a
						href="#services"
						class="btn btn-primary btn-md btn-outline w-full font-montserrat font-medium uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-1 sm:w-auto md:btn-lg"
					>
						<span class="text-xs md:text-sm">
							{t("app.hero.view_services@@View Services")}
						</span>
					</a>
				</FadeUp>
			</div>
		</section>
	);
});
