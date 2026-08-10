import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";

export const FaqSection = component$(() => {
	const t = inlineTranslate();

	const bookingQuestion = t(
		"app.faq.booking.question@@How do I book an appointment?",
	);
	const bookingAnswerBefore = t("app.faq.booking.answer_before@@Use any");
	const bookingAnswerAfter = t(
		"app.faq.booking.answer_after@@button to open live availability, then choose your treatment and preferred artist.",
	);

	const otherQuestions = [
		{
			question: t("app.faq.duration.question@@How long do treatments take?"),
			answerHtml: t(
				"app.faq.duration.answer@@Open a <a href='./pricelist' class='link link-secondary'>treatment category</a> to compare the current duration and price of every available service before booking.",
			),
		},
		{
			question: t("app.faq.location.question@@Where is the studio in Leuven?"),
			answerHtml: t(
				"app.faq.location.answer@@Our address, opening hours, map, and nearby parking links are available in the <a href='#contact' class='link link-secondary'>Visit us</a> section below.",
			),
		},
		{
			question: t(
				"app.faq.laser_prep.question@@How should I prepare for a laser treatment?",
			),
			answerHtml: t(
				"app.faq.laser_prep.answer@@Shave the area 24 hours before your session and avoid sun exposure, tanning, and self-tanner for at least 2 weeks. Please read our full <a href='./notice' class='link link-secondary'>pre- and post-care policy</a> before your appointment.",
			),
		},
		{
			question: t(
				"app.faq.cancellation.question@@Can I cancel or reschedule an appointment?",
			),
			answerHtml: t(
				"app.faq.cancellation.answer@@Yes — please cancel or reschedule at least 24 hours in advance using the booking system. You can also contact us directly via <a href='https://www.instagram.com/aestheticlabbe' target='_blank' rel='noopener noreferrer' class='link link-secondary'>Instagram</a> or by <a href='mailto:aestheticlabbe@gmail.com' class='link link-secondary'>email</a>. Late cancellations may be subject to a fee.",
			),
		},
		{
			question: t(
				"app.faq.consultation.question@@Do you offer consultations before booking?",
			),
			answerHtml: t(
				"app.faq.consultation.answer@@Absolutely. If you are unsure which treatment suits you best, <a href='#contact' class='link link-secondary'>reach out</a> and we will help you choose the right option during a short complimentary consultation.",
			),
		},
	];

	return (
		<section id="faq" class="scroll-mt-24 bg-base-200 py-16 md:py-24 lg:py-28">
			<div class="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
				<div>
					<p class="mb-4 font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:tracking-[0.24em]">
						{t("app.faq.kicker@@Before your visit")}
					</p>
					<h2 class="text-balance font-cormorant text-5xl leading-[0.9] font-light tracking-tight text-base-content md:text-7xl">
						{t("app.faq.title@@FAQ")}
					</h2>
					<p class="mt-5 max-w-sm text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
						{t(
							"app.faq.description@@A few useful details to make planning your appointment simple.",
						)}
					</p>
				</div>

				<div class="card card-border w-full bg-base-100 shadow-sm">
					{/* Booking question — uses real Booking component instead of a link */}
					<div class="collapse collapse-arrow">
						<input
							type="radio"
							name="landing-page-faq"
							aria-labelledby="faq-question-booking"
						/>
						<div
							id="faq-question-booking"
							class="collapse-title min-h-14 py-5 pr-12 font-main text-xl leading-snug font-medium text-base-content"
						>
							{bookingQuestion}
						</div>
						<div class="collapse-content pb-5">
							<div class="max-w-2xl font-main text-sm leading-7 text-base-content">
								{bookingAnswerBefore}{" "}
								<Booking
									id="faq-book-btn"
									text={t("app.book.book_app@@Book Appointment")}
									classes="btn btn-primary btn-xs min-h-8 align-baseline font-main text-xs font-semibold uppercase tracking-wider"
									analyticsPlacement="faq_booking"
								/>{" "}
								{bookingAnswerAfter}
							</div>
						</div>
					</div>

					{/* Remaining questions — use dangerouslySetInnerHTML for localized links */}
					{otherQuestions.map((item, index) => {
						const isLast = index === otherQuestions.length - 1;
						return (
							<div
								key={item.question}
								class={`collapse collapse-arrow ${isLast ? "" : "border-b border-base-300"}`}
							>
								<input
									type="radio"
									name="landing-page-faq"
									checked={isLast}
									aria-labelledby={`faq-question-${index}`}
								/>
								<div
									id={`faq-question-${index}`}
									class="collapse-title min-h-14 py-5 pr-12 font-main text-xl leading-snug font-medium text-base-content"
								>
									{item.question}
								</div>
								<div class="collapse-content pb-5">
									<p
										class="max-w-2xl font-main text-sm leading-7 text-base-content"
										dangerouslySetInnerHTML={item.answerHtml}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
});
