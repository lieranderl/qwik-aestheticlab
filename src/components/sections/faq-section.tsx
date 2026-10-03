import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SITE_METADATA } from "~/constants/metadata";

interface FaqSectionProps {
	/** Shortest and longest treatment in minutes, from the live price list. */
	durationRange?: { min: number; max: number };
}

const questionClass =
	"collapse-title grid min-h-15 grid-cols-[1.875rem_minmax(0,1fr)] items-baseline gap-2.5 py-3.5 ps-0 pe-10 font-cormorant text-[1.375rem] leading-[1.15] text-base-content after:end-1! after:top-[0.95rem]! after:text-xl after:leading-none md:after:top-[1.55rem]! md:grid-cols-[3rem_minmax(0,1fr)] md:gap-4 md:py-5 md:text-3xl";
const numberClass =
	"font-main text-[0.6875rem] font-semibold tracking-[0.14em] text-primary-content/80 md:text-[0.8125rem] md:tracking-[0.16em]";
const answerClass =
	"collapse-content ps-10 pe-0 font-main text-[0.9375rem] leading-relaxed text-base-content md:ps-16 md:text-base md:leading-[1.65] [&_a]:link";

export const FaqSection = component$<FaqSectionProps>(({ durationRange }) => {
	const t = inlineTranslate();
	const address = `${SITE_METADATA.address.street}, ${SITE_METADATA.address.zip} ${SITE_METADATA.address.city}`;

	const questions = [
		{
			question: t("app.faq.duration.question@@How long do treatments take?"),
			answerHtml: durationRange
				? t(
						"app.faq.duration.answer_range@@From {{min}} to {{max}} minutes, depending on the treatment. Every treatment’s time is on the <a href='./pricelist'>price list</a>.",
						durationRange,
					)
				: t(
						"app.faq.duration.answer_fallback@@Every treatment’s time is on the <a href='./pricelist'>price list</a>.",
					),
		},
		{
			question: t("app.faq.location.question_short@@Where is the studio?"),
			answerHtml: t(
				"app.faq.location.answer_direct@@{{address}}, in the centre of Leuven. Directions and nearby parking are under <a href='#contact'>Visit</a>.",
				{ address },
			),
		},
		{
			question: t(
				"app.faq.laser_prep.question_short@@How should I prepare for laser?",
			),
			answerHtml: t(
				"app.faq.laser_prep.answer_direct@@Shave the area 24 hours before and avoid sun, tanning and self-tanner for at least 2 weeks. Read the full <a href='./notice?tab=laser'>care notes</a> before your visit.",
			),
		},
		{
			question: t(
				"app.faq.cancellation.question_short@@Can I cancel or reschedule?",
			),
			answerHtml: t(
				"app.faq.cancellation.answer_direct@@Yes, at least 24 hours ahead in the booking system, or message us on <a href='https://www.instagram.com/aestheticlabbe' target='_blank' rel='noopener noreferrer'>Instagram</a> or by <a href='mailto:aestheticlabbe@gmail.com'>email</a>. Late cancellations may be charged.",
			),
		},
		{
			question: t(
				"app.faq.consultation.question_short@@Can I get advice before booking?",
			),
			answerHtml: t(
				"app.faq.consultation.answer_direct@@Yes. If you are unsure which treatment suits you, <a href='https://ig.me/m/aestheticlabbe' target='_blank' rel='noopener noreferrer'>ask us</a> for a short, free consultation.",
			),
		},
	];

	return (
		<section
			id="faq"
			aria-labelledby="faq-title"
			class="scroll-mt-24 bg-sage-50 py-16 md:py-24 lg:py-28"
		>
			<div class="mx-auto grid w-full max-w-7xl gap-4.5 px-4 sm:px-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-26 lg:gap-y-10 lg:px-8">
				<FadeUp>
					<KickerLabel>{t("app.faq.kicker@@Before your visit")}</KickerLabel>
					<h2
						id="faq-title"
						class="text-balance font-cormorant text-[2.875rem] leading-[0.95] text-base-content md:text-7xl lg:text-[5.5rem] lg:leading-[0.9]"
					>
						{t("app.faq.heading@@Good to know")}
					</h2>
				</FadeUp>

				<FadeUp delay={80} class="lg:col-start-2 lg:row-span-2 lg:row-start-1">
					<div class="border-t border-neutral">
						<div class="collapse collapse-plus border-b border-base-300">
							<input
								type="radio"
								name="landing-page-faq"
								checked
								aria-labelledby="faq-question-booking"
							/>
							<div id="faq-question-booking" class={questionClass}>
								<span class={numberClass}>01</span>
								{t("app.faq.booking.question@@How do I book an appointment?")}
							</div>
							<div class={answerClass}>
								<p>
									{t(
										"app.faq.booking.answer_direct@@Tap any Book button to see live availability, then choose your treatment and your preferred artist.",
									)}
								</p>
								<Booking
									id="faq-book-btn"
									text={t("app.book.book_app@@Book Appointment")}
									classes="btn btn-accent btn-sm mt-3 h-11 min-h-11 px-5 font-main text-xs font-semibold tracking-[0.16em] uppercase"
									analyticsPlacement="faq_booking"
								/>
							</div>
						</div>

						{questions.map((item, index) => (
							<div
								key={item.question}
								class="collapse collapse-plus border-b border-base-300"
							>
								<input
									type="radio"
									name="landing-page-faq"
									aria-labelledby={`faq-question-${index}`}
								/>
								<div id={`faq-question-${index}`} class={questionClass}>
									<span class={numberClass}>
										{String(index + 2).padStart(2, "0")}
									</span>
									{item.question}
								</div>
								<div class={answerClass}>
									<p
										class="max-w-150"
										dangerouslySetInnerHTML={item.answerHtml}
									/>
								</div>
							</div>
						))}
					</div>
				</FadeUp>

				<FadeUp delay={160} class="lg:col-start-1 lg:row-start-2 lg:self-end">
					<aside class="flex flex-col gap-1.5 bg-sage-200 px-5 py-4.5 text-primary-content lg:gap-2.5 lg:px-7 lg:py-6">
						<p class="font-cormorant text-[1.375rem] leading-tight italic lg:text-2xl">
							{t("app.faq.still_question@@Still have a question?")}
						</p>
						<p class="hidden font-main text-sm leading-normal lg:block">
							{t(
								"app.faq.still_question_body@@Message us on Instagram or email {{email}}.",
								{ email: SITE_METADATA.email },
							)}
						</p>
						<a
							href={SITE_METADATA.socials.instagramMessage}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex min-h-11 items-center font-main text-xs font-semibold tracking-[0.16em] uppercase underline-offset-4 hover:underline lg:btn lg:btn-neutral lg:mt-1.5 lg:h-12 lg:min-h-12 lg:self-start lg:px-5.5 lg:tracking-[0.18em] lg:no-underline"
						>
							<span class="lg:hidden">
								{t("app.faq.message_instagram@@Message us on Instagram")}
							</span>
							<span class="hidden lg:inline">
								{t("app.services.ask_us@@Ask us")}
							</span>
						</a>
					</aside>
				</FadeUp>
			</div>
		</section>
	);
});
