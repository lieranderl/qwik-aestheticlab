import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SITE_METADATA } from "~/constants/metadata";

export default component$(() => {
	const t = inlineTranslate();
	const durabilityFactors = [
		t(
			"app.notice.factor1@@The declared durability depends not only on the quality of the products but also on individual nail characteristics and aftercare.",
		),
		t(
			"app.notice.factor2@@External factors such as frequent water exposure, harsh chemicals, and mechanical damage may reduce wear time.",
		),
		t(
			"app.notice.factor3@@Personal physiology, including hormonal changes, can also affect product adhesion and durability.",
		),
	];
	const individualFactors = [
		t(
			"app.notice.water_contact@@Frequent contact with water or aggressive chemicals without gloves",
		),
		t("app.notice.mechanical_damage@@Mechanical damage to the nails"),
		t(
			"app.notice.individual_features@@Individual nail features (such as increased moisture, brittleness, or tendency to peeling)",
		),
	];

	const location = useLocation();
	const showLaser = location.url.searchParams.get("tab") === "laser";
	const laserBefore = [
		t("app.care.laser_shave@@Shave the area 24 hours before your session."),
		t(
			"app.care.laser_sun@@Avoid sun, tanning beds and self-tanner for at least 2 weeks before.",
		),
	];
	const heading =
		"flex items-baseline gap-3 font-cormorant text-[1.75rem] leading-[1.1] lg:text-[2.125rem]";
	const number =
		"font-main text-xs font-semibold tracking-[0.14em] text-primary-content/80";
	const list = "border-t border-base-300";
	const listItem = "border-b border-base-300 py-2.75 leading-[1.55]";

	return (
		<>
			<section class="bg-primary text-primary-content">
				<div class="mx-auto flex max-w-360 flex-col gap-3 px-5.5 pt-7 pb-6 md:px-10 lg:gap-5 lg:px-16 lg:py-16 xl:px-28">
					<KickerLabel tone="sage" class="mb-0">
						{t("app.care.kicker@@Before & after your visit")}
					</KickerLabel>
					<h1 class="font-cormorant text-[2.875rem] leading-[0.95] lg:text-[5rem] lg:leading-[0.9]">
						{t("app.care.title@@Care notes")}
					</h1>
					<p class="max-w-xl font-main text-sm leading-normal lg:text-base">
						{t(
							"app.care.intro@@Read these before your appointment for the best, longest-lasting result.",
						)}
					</p>
					<p class="font-main text-xs font-semibold tracking-[0.18em] uppercase">
						{t("app.notice.last_update_date@@Last updated: 01.07.2025")}
					</p>
				</div>
			</section>

			<div class="mx-auto max-w-360 px-5.5 pb-16 md:px-10 lg:px-16 lg:pb-24 xl:px-28">
				{/* DaisyUI radio tabs: native radios in a labelled radio group, so the
				    selected topic is announced ("Laser, radio, checked"). */}
				<div
					role="radiogroup"
					aria-label={t("app.care.title@@Care notes")}
					class="tabs tabs-border grid grid-cols-2 lg:max-w-3xl"
				>
					<input
						type="radio"
						name="care-notes"
						class="tab h-13 border-b border-neutral font-main text-xs font-semibold tracking-[0.18em] uppercase"
						aria-label={t("app.care.nails@@Nails")}
						checked={!showLaser}
					/>
					<div class="tab-content col-span-2 pt-6 lg:pt-10">
						<div class="flex max-w-3xl flex-col gap-8 font-main text-[0.9375rem] lg:gap-11 lg:text-base">
							<p class="font-cormorant text-[1.375rem] leading-[1.35] italic lg:text-[1.625rem]">
								{t(
									"app.notice.intro@@At our salon, we strive to deliver high-quality, long-lasting nail services using only professional products and techniques. To ensure transparency and manage expectations, please carefully read the following information:",
								)}
							</p>

							<section class="flex flex-col gap-3">
								<h2 class={heading}>
									<span class={number}>01</span>
									{t(
										"app.notice.durability_title@@Product Durability Disclaimer",
									)}
								</h2>
								<p class="leading-relaxed">
									{t(
										"app.notice.durability_intro@@Our salon works exclusively with professional materials, including gel polishes, builder gels, and hard gels from trusted brands. According to manufacturers, these products are designed to last up to 3 weeks with proper application and aftercare.",
									)}
								</p>
								<p class="font-semibold">
									{t("app.notice.however@@However, please note:")}
								</p>
								<ul class={list}>
									{durabilityFactors.map((factor) => (
										<li key={factor} class={listItem}>
											{factor}
										</li>
									))}
								</ul>
								<p
									class="border-l-2 border-primary pl-4 leading-relaxed"
									role="note"
								>
									{t(
										"app.notice.guarantee@@The salon guarantees proper and professional application of materials, but we cannot guarantee maximum wear time if external or individual factors interfere.",
									)}
								</p>
							</section>

							<section class="flex flex-col gap-3">
								<h2 class={heading}>
									<span class={number}>02</span>
									{t("app.notice.hormonal_title@@Important Notice")}
								</h2>
								<p class="leading-relaxed">
									{t(
										"app.notice.hormonal_intro@@The durability of nail coatings may vary depending on individual characteristics, including hormonal fluctuations. Please be aware that during periods of hormonal changes (such as PMS, pregnancy, breastfeeding, taking hormonal medications, or experiencing high stress levels), the adhesion of the product to the nail plate may decrease, which can affect the longevity of the coating.",
									)}
								</p>
								<p class="font-semibold">
									{t(
										"app.notice.other_factors@@Other factors that may affect durability:",
									)}
								</p>
								<ul class={list}>
									{individualFactors.map((factor) => (
										<li key={factor} class={listItem}>
											{factor}
										</li>
									))}
								</ul>
								<p
									class="border-l-2 border-primary pl-4 leading-relaxed"
									role="note"
								>
									{t(
										"app.notice.understanding@@Please understand that in the presence of these factors, the salon cannot guarantee standard wear time of the coating.",
									)}
								</p>
							</section>

							<section class="flex flex-col gap-3 bg-primary px-5 py-6 text-primary-content lg:px-8 lg:py-7">
								<h2 class={heading}>
									<span class="font-main text-xs font-semibold tracking-[0.14em]">
										03
									</span>
									{t("app.notice.policy_title@@Complimentary Fix Policy")}
								</h2>
								<p class="leading-relaxed">
									{t(
										"app.notice.policy_description@@If you experience any issues with your manicure within the first 5 days after your appointment, you are welcome to come back for a free correction.",
									)}
								</p>
								<p class="leading-relaxed">
									{t(
										"app.notice.policy_care@@We care about your satisfaction and will be happy to fix any issues that may arise within this period.",
									)}
								</p>
							</section>

							<p class="border-t border-neutral pt-4 font-cormorant text-xl leading-snug italic">
								{t(
									"app.notice.thank_you@@Thank you for your understanding, trust, and cooperation! We look forward to making your nails beautiful and long-lasting.",
								)}
							</p>
						</div>
					</div>

					<input
						type="radio"
						name="care-notes"
						class="tab h-13 border-b border-neutral font-main text-xs font-semibold tracking-[0.18em] uppercase"
						aria-label={t("app.care.laser@@Laser")}
						checked={showLaser}
					/>
					<div class="tab-content col-span-2 pt-6 lg:pt-10">
						<div class="flex max-w-3xl flex-col gap-8 font-main text-[0.9375rem] lg:gap-11 lg:text-base">
							<section class="flex flex-col gap-3">
								<h2 class={heading}>
									<span class={number}>01</span>
									{t("app.care.laser_before@@Before your session")}
								</h2>
								<ul class={list}>
									{laserBefore.map((item) => (
										<li key={item} class={listItem}>
											{item}
										</li>
									))}
								</ul>
							</section>
							<section class="flex flex-col gap-2 bg-primary px-5 py-5 text-primary-content lg:px-8 lg:py-6">
								<p class="font-cormorant text-[1.375rem] italic">
									{t("app.faq.still_question@@Still have a question?")}
								</p>
								<a
									href={SITE_METADATA.socials.instagramMessage}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex min-h-11 items-center self-start font-main text-xs font-semibold tracking-[0.16em] uppercase underline-offset-4 hover:underline"
								>
									{t("app.faq.message_instagram@@Message us on Instagram")}
								</a>
							</section>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});

export const head: DocumentHead = () => {
	const t = inlineTranslate();
	return {
		title: t("app.head.care.title@@Care notes | Aesthetic Lab"),
		meta: [
			{
				name: "description",
				content: t(
					"app.head.notice.description@@Important treatment durability, aftercare, and complimentary fix information for Aesthetic Lab clients.",
				),
			},
		],
	};
};
