import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";

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

	return (
		<section class="w-full bg-base-200 pb-12 sm:pb-16 md:pb-20">
			<div class="mx-auto max-w-3xl">
				<header class="mb-8 sm:mb-10">
					<h1 class="text-balance font-qestero text-4xl leading-tight text-base-content sm:text-5xl">
						{t("app.notice.important_info@@Important Client Information")}
					</h1>
					<div class="my-5 h-px w-16 bg-primary" />
					<p class="badge badge-outline min-h-7 border-base-300 px-3 font-montserrat text-xs font-medium uppercase tracking-wider text-base-content sm:text-sm">
						{t("app.notice.last_update_date@@Last updated: 01.07.2025")}
					</p>
				</header>

				<div class="space-y-6 font-montserrat text-base-content sm:space-y-8">
					<div class="alert bg-base-100 px-5 py-5 shadow-sm sm:px-8 sm:py-6">
						<p class="text-sm leading-7 sm:text-base">
							{t(
								"app.notice.intro@@At our salon, we strive to deliver high-quality, long-lasting nail services using only professional products and techniques. To ensure transparency and manage expectations, please carefully read the following information:",
							)}
						</p>
					</div>

					<div class="card surface-card">
						<div class="card-body gap-0 p-5 sm:p-8 md:p-10">
							<section class="border-b border-base-300/50 pb-8 sm:pb-10">
								<h2 class="font-qestero text-2xl leading-tight text-secondary sm:text-3xl">
									{t(
										"app.notice.durability_title@@Product Durability Disclaimer",
									)}
								</h2>
								<p class="mt-4 text-sm leading-7 sm:text-base">
									{t(
										"app.notice.durability_intro@@Our salon works exclusively with professional materials, including gel polishes, builder gels, and hard gels from trusted brands. According to manufacturers, these products are designed to last up to 3 weeks with proper application and aftercare.",
									)}
								</p>
								<p class="mt-5 text-sm font-semibold text-secondary sm:text-base">
									{t("app.notice.however@@However, please note:")}
								</p>
								<ul class="list mt-3 rounded-box bg-base-200/45 py-1 text-sm sm:text-base">
									{durabilityFactors.map((factor) => (
										<li key={factor} class="list-row gap-3 px-4 py-3">
											<span aria-hidden="true" class="pt-0.5 text-primary">
												✦
											</span>
											<span class="leading-6">{factor}</span>
										</li>
									))}
								</ul>
								<div
									class="alert alert-warning alert-soft mt-5 px-4 py-4"
									role="note"
								>
									<p class="text-sm font-medium leading-6 sm:text-base">
										{t(
											"app.notice.guarantee@@The salon guarantees proper and professional application of materials, but we cannot guarantee maximum wear time if external or individual factors interfere.",
										)}
									</p>
								</div>
							</section>

							<section class="border-b border-base-300/50 py-8 sm:py-10">
								<h2 class="font-qestero text-2xl leading-tight text-secondary sm:text-3xl">
									{t("app.notice.hormonal_title@@Important Notice")}
								</h2>
								<p class="mt-4 text-sm leading-7 sm:text-base">
									{t(
										"app.notice.hormonal_intro@@The durability of nail coatings may vary depending on individual characteristics, including hormonal fluctuations. Please be aware that during periods of hormonal changes (such as PMS, pregnancy, breastfeeding, taking hormonal medications, or experiencing high stress levels), the adhesion of the product to the nail plate may decrease, which can affect the longevity of the coating.",
									)}
								</p>
								<p class="mt-5 text-sm font-semibold text-secondary sm:text-base">
									{t(
										"app.notice.other_factors@@Other factors that may affect durability:",
									)}
								</p>
								<ul class="list mt-3 rounded-box bg-base-200/45 py-1 text-sm sm:text-base">
									{individualFactors.map((factor) => (
										<li key={factor} class="list-row gap-3 px-4 py-3">
											<span aria-hidden="true" class="pt-0.5 text-primary">
												✦
											</span>
											<span class="leading-6">{factor}</span>
										</li>
									))}
								</ul>
								<div
									class="alert alert-info alert-soft mt-5 px-4 py-4"
									role="note"
								>
									<p class="text-sm font-medium leading-6 sm:text-base">
										{t(
											"app.notice.understanding@@Please understand that in the presence of these factors, the salon cannot guarantee standard wear time of the coating.",
										)}
									</p>
								</div>
							</section>

							<section class="pt-8 sm:pt-10">
								<h2 class="font-qestero text-2xl leading-tight text-secondary sm:text-3xl">
									{t("app.notice.policy_title@@Complimentary Fix Policy")}
								</h2>
								<p class="mt-4 text-sm leading-7 sm:text-base">
									{t(
										"app.notice.policy_description@@If you experience any issues with your manicure within the first 5 days after your appointment, you are welcome to come back for a free correction.",
									)}
								</p>
								<p class="mt-4 text-sm font-medium leading-7 text-secondary sm:text-base">
									{t(
										"app.notice.policy_care@@We care about your satisfaction and will be happy to fix any issues that may arise within this period.",
									)}
								</p>
							</section>
						</div>
					</div>

					<div class="alert bg-base-100 px-5 py-5 text-center shadow-sm sm:px-8 sm:py-6">
						<p class="w-full font-qestero text-xl leading-relaxed text-primary sm:text-2xl">
							{t(
								"app.notice.thank_you@@Thank you for your understanding, trust, and cooperation! We look forward to making your nails beautiful and long-lasting. 💅✨",
							)}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
});

export const head: DocumentHead = () => {
	const t = inlineTranslate();
	return {
		title: t("app.head.notice.title@@Client Information | Aesthetic Lab"),
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
