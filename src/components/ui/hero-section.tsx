import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "./booking-modal";
import { FadeUp } from "./fade-up";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="relative min-h-screen w-full overflow-hidden bg-base-100 flex items-center justify-center">
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
						<span class="font-montserrat mb-4 block text-sm uppercase tracking-[0.2em] text-secondary">
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
							class="w-[80vw] max-w-[600px] h-auto text-primary"
						/>
					</FadeUp>

					<FadeUp delay={400} duration={1000} direction="up">
						<div class="font-montserrat mx-auto max-w-xl text-neutral-content/80">
							<div class="text-lg md:text-xl font-normal tracking-wide mb-2 flex flex-col md:flex-row items-center justify-center gap-2">
								<span>{t("app.hero.the_best@@The best")}</span>

								{/* Restored Text Rotation */}
								<span class="text-rotate text-left overflow-hidden inline-flex flex-col">
									<span class="font-bold justify-items-center">
										<span class="block text-warning ">
											{t("app.hero.manicure@@manicure")}
										</span>
										<span class="block  text-secondary ">
											{t("app.hero.pedicure@@pedicure")}
										</span>
										<span class="block  text-accent ">
											{t("app.hero.brows@@brows")}
										</span>
										<span class="block text-info">
											{t("app.hero.lashes@@lashes")}
										</span>
										<span class="block text-success">
											{t("app.hero.laser@@laser")}
										</span>
									</span>
								</span>

								<span>{t("app.hero.in_leuven@@in Leuven")}</span>
							</div>
							<p class="text-xs  tracking-[0.2em] opacity-60">
								{t("app.hero.according@@*voted by our clients")}
							</p>
						</div>
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
						classes="hidden md:inline-flex btn btn-primary btn-lg rounded-full text-white font-montserrat font-medium tracking-widest uppercase shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 border-none px-8"
					/>

					<a
						href="#services"
						class="btn btn-outline border-base-content/20 text-base-content btn-lg rounded-full font-montserrat font-medium tracking-widest uppercase hover:bg-base-content hover:text-base-100 hover:-translate-y-1 transition-all duration-300 px-8"
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
