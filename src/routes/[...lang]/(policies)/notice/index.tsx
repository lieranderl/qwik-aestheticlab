import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";

export default component$(() => {
	const t = inlineTranslate();
	return (
		<section class=" min-h-screen w-full overflow-hidden bg-base-200 py-24 z-0">
			<div class="container mx-auto px-2 md:px-8 max-w-6xl relative z-10">
				<FadeUp>
					<div class="text-center mb-16">
						<h1 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
							{t("app.notice.important_info@@Important Client Information")}
						</h1>
						<div class="h-px w-20 bg-primary mx-auto mb-6" />
						<p class="font-montserrat text-sm text-neutral-content uppercase tracking-widest">
							{t("app.notice.last_update@@Last updated:")} 01.07.2025
						</p>
					</div>

					<div class="prose max-w-none mx-auto bg-transparent font-montserrat text-base-content/80">
						{/* Intro Card */}
						<div class="card bg-base-100 shadow-sm border border-base-200 mb-8">
							<div class="card-body">
								<p class="text-lg leading-relaxed text-center italic">
									{t(
										"app.notice.intro@@At our salon, we strive to deliver high-quality, long-lasting nail services using only professional products and techniques. To ensure transparency and manage expectations, please carefully read the following information:",
									)}
								</p>
							</div>
						</div>

						{/* Product Durability Card */}
						<div class="card bg-base-100 shadow-sm border border-base-200 mb-8">
							<div class="card-body">
								<h2 class="card-title font-qestero text-3xl text-base-content mb-4">
									{t(
										"app.notice.durability_title@@Product Durability Disclaimer",
									)}
								</h2>
								<p class="mb-6 leading-relaxed">
									{t(
										"app.notice.durability_intro@@Our salon works exclusively with professional materials, including gel polishes, builder gels, and hard gels from trusted brands. According to manufacturers, these products are designed to last up to 3 weeks with proper application and aftercare.",
									)}
								</p>
								<p class="mb-4 font-semibold text-secondary">
									{t("app.notice.however@@However, please note:")}
								</p>
								<ul class="space-y-4 mb-8 bg-base-200/30 p-6 rounded-xl">
									{[
										"app.notice.factor1@@The declared durability depends not only on the quality of the products but also on individual nail characteristics and aftercare.",
										"app.notice.factor2@@External factors such as frequent water exposure, harsh chemicals, and mechanical damage may reduce wear time.",
										"app.notice.factor3@@Personal physiology, including hormonal changes, can also affect product adhesion and durability.",
									].map((key) => (
										<li key={key} class="flex items-start gap-3">
											<span class="text-primary mt-1">✦</span>
											<span>{t(key)}</span>
										</li>
									))}
								</ul>
								<div class="p-6 bg-warning/10 border-l-4 border-warning rounded-lg">
									<p class="text-sm md:text-base font-medium text-base-content">
										{t(
											"app.notice.guarantee@@The salon guarantees proper and professional application of materials, but we cannot guarantee maximum wear time if external or individual factors interfere.",
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Important Notice (Hormonal) Card */}
						<div class="card bg-base-100 shadow-sm border border-base-200 mb-8">
							<div class="card-body">
								<h2 class="card-title font-qestero text-3xl text-base-content mb-4">
									{t("app.notice.hormonal_title@@Important Notice")}
								</h2>
								<p class="mb-6 leading-relaxed">
									{t(
										"app.notice.hormonal_intro@@The durability of nail coatings may vary depending on individual characteristics, including hormonal fluctuations. Please be aware that during periods of hormonal changes (such as PMS, pregnancy, breastfeeding, taking hormonal medications, or experiencing high stress levels), the adhesion of the product to the nail plate may decrease, which can affect the longevity of the coating.",
									)}
								</p>
								<p class="mb-4 font-semibold text-secondary">
									{t(
										"app.notice.other_factors@@Other factors that may affect durability:",
									)}
								</p>
								<ul class="space-y-4 mb-8 bg-base-200/30 p-6 rounded-xl">
									{[
										"app.notice.water_contact@@Frequent contact with water or aggressive chemicals without gloves",
										"app.notice.mechanical_damage@@Mechanical damage to the nails",
										"app.notice.individual_features@@Individual nail features (such as increased moisture, brittleness, or tendency to peeling)",
									].map((key) => (
										<li key={key} class="flex items-start gap-3">
											<span class="text-primary mt-1">✦</span>
											<span>{t(key)}</span>
										</li>
									))}
								</ul>
								<div class="p-6 bg-info/10 border-l-4 border-info rounded-lg">
									<p class="text-sm md:text-base font-medium text-base-content">
										{t(
											"app.notice.understanding@@Please understand that in the presence of these factors, the salon cannot guarantee standard wear time of the coating.",
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Fix Policy Card */}
						<div class="card bg-base-100 shadow-sm border border-base-200 mb-8">
							<div class="card-body">
								<h2 class="card-title font-qestero text-3xl text-base-content mb-4">
									{t("app.notice.policy_title@@Complimentary Fix Policy")}
								</h2>
								<p class="mb-4 leading-relaxed">
									{t(
										"app.notice.policy_description@@If you experience any issues with your manicure within the first 5 days after your appointment, you are welcome to come back for a free correction.",
									)}
								</p>
								<p class="leading-relaxed font-medium text-secondary">
									{t(
										"app.notice.policy_care@@We care about your satisfaction and will be happy to fix any issues that may arise within this period.",
									)}
								</p>
							</div>
						</div>

						{/* Thank You Footer */}
						<div class="text-center p-8 mt-16">
							<p class="text-xl font-qestero text-primary">
								{t(
									"app.notice.thank_you@@Thank you for your understanding, trust, and cooperation! We look forward to making your nails beautiful and long-lasting. 💅✨",
								)}
							</p>
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
