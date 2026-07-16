import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { RotatingText } from "~/components/ui/rotating-text";
import AestheticLabLogo from "~/media/AestheticLab.svg?jsx";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section
			id="hero"
			class="hero relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-base-200 pt-[calc(env(safe-area-inset-top)+5.25rem)] pb-10 md:pt-[calc(env(safe-area-inset-top)+6.5rem)] md:pb-16"
		>
			<div class="custom-container relative z-10 flex flex-col items-center justify-center text-center">
				{/* Main Headline Group */}
				<div class="relative mb-8 flex flex-col items-center md:mb-12">
					<span class="mb-4 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-primary md:text-sm md:tracking-[0.2em]">
						{t("app.hero.slogan@@The Art of Natural Beauty")}
					</span>

					<h1 class="mb-6 flex justify-center text-primary md:mb-8">
						<AestheticLabLogo
							class="h-auto w-[78vw] max-w-100 text-primary md:w-[54vw] md:max-w-lg"
							role="img"
							aria-label="Aesthetic Lab"
						/>
					</h1>

					<RotatingText />
				</div>

				{/* Action Buttons */}
				<div class="flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row">
					<Booking
						id="hero-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						location="372146"
						classes="btn btn-primary btn-md inline-flex h-12 min-h-12 w-full justify-center px-7 font-montserrat text-xs font-medium uppercase tracking-[0.12em] transition-[background-color,border-color,box-shadow] duration-200 sm:w-auto md:text-sm"
						analyticsPlacement="hero"
					/>

					<a
						href="#services"
						class="btn btn-primary btn-outline btn-md h-12 min-h-12 w-full px-7 font-montserrat font-medium uppercase tracking-[0.12em] transition-[background-color,border-color,box-shadow] duration-200 sm:w-auto"
					>
						<span class="text-xs md:text-sm">
							{t("app.hero.view_services@@View Services")}
						</span>
					</a>
				</div>
			</div>
		</section>
	);
});
