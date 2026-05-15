import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { RotatingText } from "~/components/ui/rotating-text";
import AestheticLabLogo from "~/media/AestheticLab.svg?jsx";
import ImgManicure1 from "~/media/gallery/manicure1.jpg?jsx";
import ImgPedicure1 from "~/media/gallery/pedicure1.jpg?jsx";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="relative flex min-h-svh w-full items-center justify-center overflow-hidden pt-[calc(env(safe-area-inset-top)+6rem)] pb-16 md:pt-[calc(env(safe-area-inset-top)+7rem)] md:pb-20">
			{/* Decorative Background Elements - Enhanced Atmosphere */}
			<div class="absolute -left-20 top-0 h-150 w-150 rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
			<div
				class="absolute -right-20 bottom-0 h-175 w-175 rounded-full bg-secondary/10 blur-[130px] animate-pulse-slow"
				style={{ animationDelay: "4s" }}
			/>

			<div class="custom-container relative z-10 flex flex-col items-center justify-center text-center">
				{/* Main Headline Group */}
				<div class="mb-12 relative flex flex-col items-center">
					<FadeUp delay={100} duration={1000} direction="down">
						<span class="font-montserrat mb-4 block text-sm uppercase tracking-[0.2em] text-primary font-semibold">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</span>
					</FadeUp>

					<FadeUp
						delay={300}
						duration={1200}
						class="flex justify-center text-primary mb-8"
						direction="up"
						distance={40}
					>
						<AestheticLabLogo
							class="w-[60vw] max-w-150 h-auto text-primary"
							aria-label="Aesthetic Lab"
						/>
					</FadeUp>

					<FadeUp delay={400} duration={1000} direction="up">
						<RotatingText />
					</FadeUp>
				</div>

				{/* Action Buttons */}
				<FadeUp
					delay={600}
					duration={1000}
					class="flex flex-col gap-5 sm:flex-row items-center justify-center"
					direction="up"
				>
					<Booking
						id="hero-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						location="372146"
						classes="inline-flex w-full max-w-xs justify-center sm:w-auto btn btn-primary btn-lg font-montserrat font-medium tracking-widest uppercase hover:-translate-y-1 transition-all duration-300"
						analyticsPlacement="hero"
					/>

					<a
						href="#services"
						class="btn btn-primary btn-lg btn-outline w-full max-w-xs sm:w-auto font-montserrat font-medium tracking-widest uppercase hover:-translate-y-1 transition-all duration-300"
					>
						<span class="text-xs md:text-sm">
							{t("app.hero.view_services@@View Services")}
						</span>
					</a>
				</FadeUp>

				{/* Floating Glassmorphism Images */}
				<div class="absolute inset-0 pointer-events-none overflow-hidden">
					{/* Left Image - Manicure */}
					<div class="absolute bottom-20 left-4 lg:bottom-1/4 lg:left-20 xl:left-32 hidden md:block">
						<FadeUp
							delay={1000}
							duration={1500}
							direction="right"
							distance={80}
						>
							<div class="animate-float-reverse relative">
								<div class="w-42 lg:w-56 aspect-3/4 rounded-2xl overflow-hidden border border-white/40 shadow-2xl -rotate-6 backdrop-blur-sm bg-white/5">
									<ImgManicure1
										class="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
										alt="Manicure Art"
									/>
									{/* Glossy Overlay */}
									<div class="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-50" />
								</div>
							</div>
						</FadeUp>
					</div>

					{/* Right Image - Pedicure/Brows */}
					<div class="absolute top-32 right-4 md:right-10 lg:top-1/4 lg:right-20 xl:right-32 hidden md:block">
						<FadeUp delay={1200} duration={1500} direction="left" distance={80}>
							<div class="animate-float relative">
								<div class="w-40 lg:w-48 aspect-3/4 rounded-2xl overflow-hidden border border-white/40 shadow-2xl rotate-6 backdrop-blur-sm bg-white/5">
									<ImgPedicure1
										class="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
										alt="Aesthetic Detail"
									/>
									<div class="absolute inset-0 bg-linear-to-bl from-white/0 via-white/20 to-white/0 opacity-50" />
								</div>
							</div>
						</FadeUp>
					</div>
				</div>
			</div>
		</section>
	);
});
