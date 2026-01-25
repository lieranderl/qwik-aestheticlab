import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";

export const HeroSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="relative min-h-screen w-full overflow-hidden bg-base-100">
			{/* Decorative Background Elements */}
			<div class="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
			<div class="absolute -right-20 bottom-0 h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[120px]" />

			<div class="custom-container relative flex min-h-screen flex-col items-center justify-center pt-20 text-center">
				<FadeUp delay={100} duration={1000} direction="down">
					<span class="font-montserrat mb-4 block text-sm uppercase tracking-[0.2em] text-secondary">
						{t("app.hero.slogan@@The Art of Natural Beauty")}
					</span>
				</FadeUp>

				<FadeUp
					delay={300}
					duration={1200}
					class="flex justify-center text-primary"
					direction="up"
					distance={40}
				>
					{/* Logo uses currentColor, so it will inherit the text color */}
					<img
						src="/media/AestheticLab.svg"
						alt="Aesthetic Lab"
						width="600"
						height="180"
						class="w-[80vw] max-w-[600px] h-auto text-primary"
					/>
				</FadeUp>

				<FadeUp delay={600} duration={1000} direction="up">
					<div class="font-montserrat mx-auto mb-10 max-w-2xl text-neutral-content">
						<p class="text-base md:text-lg mb-3">
							<span>{t("app.hero.the_best@@The best")}</span>
							<span class="text-rotate text-left">
								<span class="justify-items-center text-left">
									<span class="px-2 text-pink-500">
										{t("app.hero.manicure@@manicure")}
									</span>
									<span class="px-2 text-rose-500">
										{t("app.hero.pedicure@@pedicure")}
									</span>
									<span class="px-2 text-fuchsia-600">
										{t("app.hero.brows@@brows")}
									</span>
									<span class="px-2 text-violet-600">
										{t("app.hero.laser@@laser")}
									</span>
								</span>
							</span>
							<span>{t("app.hero.in_leuven@@in Leuven")}</span>
						</p>
						<p class="text-xs md:text-sm opacity-60 italic">
							{t("app.hero.according@@*according to our clients")}
						</p>
					</div>
				</FadeUp>

				<FadeUp
					delay={800}
					duration={1000}
					class="flex flex-col gap-4 sm:flex-row"
					direction="up"
				>
					<Booking
						id="hero-book-btn"
						text={t("app.book.book_app@@Book Appointment")}
						location="372146"
						classes="hidden md:inline-flex btn btn-primary btn-lg rounded-full text-white font-montserrat font-medium tracking-widest uppercase z-10 shadow-lg hover:shadow-xl border-none"
					/>

					<a
						href="#services"
						class="btn btn-outline btn-primary btn-lg rounded-full font-montserrat font-medium tracking-widest uppercase hover:bg-primary/10 hover:text-primary"
					>
						<span class="font-montserrat text-sm font-medium tracking-widest uppercase">
							{t("app.hero.view_services@@View Services")}
						</span>
					</a>
				</FadeUp>

				{/* Floating Image Cards (Decorative) */}
				<FadeUp
					delay={1200}
					duration={1800}
					direction="left"
					distance={100}
					class="absolute bottom-20 right-10 hidden w-48 rotate-3 lg:block"
				>
					<div class="aspect-3/4 overflow-hidden rounded-2xl shadow-xl">
						{/* Decorative Card 1 */}
						<img
							src="/media/gallery/manicure1.jpg"
							class="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110"
							alt="Nail Art"
							width="300"
							height="400"
						/>
					</div>
				</FadeUp>

				<FadeUp
					delay={1400}
					duration={1800}
					direction="right"
					distance={100}
					class="absolute bottom-40 left-10 hidden w-40 -rotate-2 lg:block"
				>
					<div class="aspect-3/4 overflow-hidden rounded-2xl shadow-xl">
						<img
							src="/media/gallery/pedicure1.jpg"
							class="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110"
							alt="Pedicure"
							width="300"
							height="400"
						/>
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
