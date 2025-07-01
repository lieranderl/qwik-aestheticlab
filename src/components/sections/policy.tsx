import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export const PolicySection = component$(() => {
	const t = inlineTranslate();
	return (
		<section id="policy" class="py-20 bg-base-200">
			<div class="custom-container">
				<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
					{t("app.policy.title@@Complimentary Fix Policy")}
				</h2>
				<div class="max-w-4xl mx-auto">
					<div class="bg-base-200" data-aos="fade-up">
						<div class="text-center">
							<p class="text-lg mb-6 leading-relaxed">
								{t(
									"app.notice.policy_description@@If you experience any issues with your manicure within the first 5 days after your appointment, you are welcome to come back for a free correction.",
								)}
							</p>
							<p class="text-base text-base-content/80 italic">
								{t(
									"app.policy.care@@We care about your satisfaction and will be happy to fix any problems that may arise.",
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
});
