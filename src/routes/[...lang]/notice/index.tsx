import { component$ } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate, localizePath, useSpeakLocale } from "qwik-speak";
import { ChangeLocale } from "~/components/change-locale";

export default component$(() => {
	const t = inlineTranslate();
	const locale = useSpeakLocale();
	const getPath = localizePath();
	const pathtohome = getPath("/", locale.lang);
	return (
		<div class="min-h-screen bg-base-100 text-base-content p-2 md:p-6">
			<div class="max-w-3xl mx-auto bg-base-200 p-8 rounded-box shadow-lg">
				<div class="flex justify-between items-center mb-12">
					<a href={pathtohome} class="link">
						<HiHomeOutline class="text-xl md:text-3xl text-primary" />
					</a>
					<ChangeLocale />
				</div>

				<h1 class="text-3xl font-bold text-primary mb-6">
					{t("app.notice.important_info@@✨ Important Client Information ✨")}
				</h1>
				<p class="mb-4">
					{t("app.notice.last_update@@Last updated:")} 01.07.2025
				</p>

				<p class="mb-6 text-lg leading-relaxed">
					{t(
						"app.notice.intro@@At our salon, we strive to deliver high-quality, long-lasting nail services using only professional products and techniques. To ensure transparency and manage expectations, please carefully read the following information:",
					)}
				</p>

				<div class="divider"></div>

				<h2 class="text-2xl font-semibold text-secondary mb-4">
					{t("app.notice.durability_title@@Product Durability Disclaimer")}
				</h2>

				<p class="mb-4 leading-relaxed">
					{t(
						"app.notice.durability_intro@@Our salon works exclusively with professional materials, including gel polishes, builder gels, and hard gels from trusted brands. According to manufacturers, these products are designed to last up to 3 weeks with proper application and aftercare.",
					)}
				</p>

				<p class="mb-3 font-medium">
					{t("app.notice.however@@However, please note:")}
				</p>

				<ul class="mb-4 space-y-2">
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.factor1@@The declared durability depends not only on the quality of the products but also on individual nail characteristics and aftercare.",
							)}
						</span>
					</li>
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.factor2@@External factors such as frequent water exposure, harsh chemicals, and mechanical damage may reduce wear time.",
							)}
						</span>
					</li>
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.factor3@@Personal physiology, including hormonal changes, can also affect product adhesion and durability.",
							)}
						</span>
					</li>
				</ul>

				<p class="mb-6 p-4 bg-warning/20 rounded-lg border-l-4 border-warning">
					{t(
						"app.notice.guarantee@@The salon guarantees proper and professional application of materials, but we cannot guarantee maximum wear time if external or individual factors interfere.",
					)}
				</p>

				<div class="divider"></div>

				<h2 class="text-2xl font-semibold text-secondary mb-4">
					{t("app.notice.hormonal_title@@Important Notice")}
				</h2>

				<p class="mb-4 leading-relaxed">
					{t(
						"app.notice.hormonal_intro@@The durability of nail coatings may vary depending on individual characteristics, including hormonal fluctuations. Please be aware that during periods of hormonal changes (such as PMS, pregnancy, breastfeeding, taking hormonal medications, or experiencing high stress levels), the adhesion of the product to the nail plate may decrease, which can affect the longevity of the coating.",
					)}
				</p>

				<p class="mb-3 font-medium">
					{t(
						"app.notice.other_factors@@Other factors that may affect durability:",
					)}
				</p>

				<ul class="mb-4 space-y-2">
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.water_contact@@Frequent contact with water or aggressive chemicals without gloves",
							)}
						</span>
					</li>
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.mechanical_damage@@Mechanical damage to the nails",
							)}
						</span>
					</li>
					<li class="flex items-start">
						<span class="text-success mr-2">✔️</span>
						<span>
							{t(
								"app.notice.individual_features@@Individual nail features (such as increased moisture, brittleness, or tendency to peeling)",
							)}
						</span>
					</li>
				</ul>

				<p class="mb-6 p-4 bg-info/20 rounded-lg border-l-4 border-info">
					{t(
						"app.notice.understanding@@Please understand that in the presence of these factors, the salon cannot guarantee standard wear time of the coating.",
					)}
				</p>

				<div class="divider"></div>

				<h2 class="text-2xl font-semibold text-secondary mb-4">
					{t("app.notice.policy_title@@Complimentary Fix Policy")}
				</h2>

				<p class="mb-4 leading-relaxed">
					{t(
						"app.notice.policy_description@@If you experience any issues with your manicure within the first 5 days after your appointment, you are welcome to come back for a free correction.",
					)}
				</p>

				<p class="mb-6 leading-relaxed">
					{t(
						"app.notice.policy_care@@We care about your satisfaction and will be happy to fix any issues that may arise within this period.",
					)}
				</p>

				<div class="divider"></div>

				<div class="text-center p-6 bg-primary/10 rounded-lg">
					<p class="text-lg font-medium text-primary">
						{t(
							"app.notice.thank_you@@Thank you for your understanding, trust, and cooperation! We look forward to making your nails beautiful and long-lasting. 💅✨",
						)}
					</p>
				</div>
			</div>
		</div>
	);
});
