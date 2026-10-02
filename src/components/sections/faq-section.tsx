import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Booking } from "~/components/ui/booking-modal";
import { KickerLabel } from "~/components/ui/kicker-label";

export const FaqSection = component$(() => {
	const bookingQuestion = _`faq.booking.question`;
	const bookingAnswerBefore = _`faq.booking.answer_before`;
	const bookingAnswerAfter = _`faq.booking.answer_after`;

	const otherQuestions = [
		{
			question: _`faq.duration.question`,
			answerHtml: _`faq.duration.answer`,
		},
		{
			question: _`faq.location.question`,
			answerHtml: _`faq.location.answer`,
		},
		{
			question: _`faq.laser_prep.question`,
			answerHtml: _`faq.laser_prep.answer`,
		},
		{
			question: _`faq.cancellation.question`,
			answerHtml: _`faq.cancellation.answer`,
		},
		{
			question: _`faq.consultation.question`,
			answerHtml: _`faq.consultation.answer`,
		},
	];

	return (
		<section id="faq" class="scroll-mt-24 bg-base-200 py-16 md:py-24 lg:py-28">
			<div class="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
				<div>
					<KickerLabel>{_`faq.kicker`}</KickerLabel>
					<h2 class="text-balance font-cormorant text-5xl leading-[0.9] font-light tracking-tight text-base-content md:text-7xl">
						{_`faq.title`}
					</h2>
					<p class="mt-5 max-w-sm text-pretty font-main text-[0.9375rem] leading-relaxed text-base-content/80 md:text-base">
						{_`faq.description`}
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
									text={_`book.book_app`}
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
