import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { RotatingText } from "~/components/ui/rotating-text";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
			{/* Decorative Background Elements - Enhanced Atmosphere */}
			<div class="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
			<div
				class="absolute -right-20 bottom-0 h-[700px] w-[700px] rounded-full bg-secondary/10 blur-[130px] animate-pulse-slow"
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
						<img
							src="/media/AestheticLab.svg"
							alt="Aesthetic Lab"
							width="600"
							height="180"
							class="w-[60vw] max-w-[600px] h-auto text-primary"
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
						classes="hidden md:inline-flex btn btn-primary btn-lg font-montserrat font-medium tracking-widest uppercase hover:-translate-y-1 transition-all duration-300"
					/>

					<a
						href="#services"
						class="btn btn-primary btn-lg btn-outline font-montserrat font-medium tracking-widest uppercase hover:-translate-y-1 transition-all duration-300"
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
									<img
										src="/media/gallery/manicure1.jpg"
										class="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
										alt="Manicure Art"
										width="300"
										height="400"
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
									<img
										src="/media/gallery/pedicure1.jpg"
										class="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
										alt="Aesthetic Detail"
										width="300"
										height="400"
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
