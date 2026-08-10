import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";

export const BookingCtaSection = component$(() => {
	const t = inlineTranslate();

	return (
		<section class="bg-base-100 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
			<div class="card card-border relative mx-auto max-w-7xl overflow-hidden bg-base-200 transition-[box-shadow,border-color] duration-200 motion-safe:hover:shadow-lg">
				<div class="card-body relative z-10 grid gap-8 p-6 sm:p-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12 lg:gap-12 lg:p-16">
					<div class="max-w-3xl">
						<div class="mb-6 flex items-center gap-3 font-montserrat text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-secondary">
							<span class="status status-sm" aria-hidden="true" />
							{t("app.contact.appointment_only@@By appointment only")}
						</div>
						<h2 class="text-balance font-cormorant text-4xl leading-[0.95] text-base-content sm:text-5xl lg:text-6xl">
							{t("app.cta.title@@Ready to feel beautifully yourself?")}
						</h2>
						<p class="mt-4 max-w-xl font-montserrat text-sm leading-7 text-base-content/80 md:text-base">
							{t("app.cta.description@@Book your moment of considered care")}
						</p>
					</div>
					<div class="card-actions w-full md:w-auto">
						<Booking
							id="final-book-btn"
							text={t("app.book.book_app@@Book Appointment")}
							location="372146"
							analyticsPlacement="final_cta"
							classes="btn btn-neutral btn-lg min-h-12 w-full px-7 font-montserrat text-xs font-semibold uppercase tracking-[0.1em] transition-shadow duration-200 motion-safe:hover:shadow-md md:w-auto"
						/>
					</div>
				</div>
			</div>
		</section>
	);
});
