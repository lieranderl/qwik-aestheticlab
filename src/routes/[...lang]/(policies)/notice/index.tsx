import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";

export default component$(() => {
	const durabilityFactors = [
		_`notice.factor1`,
		_`notice.factor2`,
		_`notice.factor3`,
	];
	const individualFactors = [
		_`notice.water_contact`,
		_`notice.mechanical_damage`,
		_`notice.individual_features`,
	];

	return (
		<section class="grid gap-10 lg:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.38fr)] lg:gap-16 xl:gap-24">
			<header class="lg:sticky lg:top-32 lg:self-start">
				<p class="font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
					Aesthetic Lab Leuven
				</p>
				<h1 class="mt-4 text-balance font-cormorant text-5xl leading-[0.95] text-base-content sm:text-6xl lg:text-7xl">
					{_`notice.important_info`}
				</h1>
				<div class="my-6 h-px w-20 bg-primary" />
				<p class="max-w-sm font-main text-sm leading-7 text-base-content">
					{_`head.notice.description`}
				</p>
				<p class="badge badge-outline mt-6 min-h-7 border-base-300 px-3 font-main text-xs font-medium uppercase tracking-wider text-base-content">
					{_`notice.last_update_date`}
				</p>
			</header>

			<div class="space-y-6 font-main text-base-content sm:space-y-8">
				<div class="alert border border-base-300 bg-base-100 px-5 py-5 shadow-sm sm:px-8 sm:py-6">
					<p class="text-sm leading-7 sm:text-base">{_`notice.intro`}</p>
				</div>

				<div class="card card-border overflow-hidden border-base-300 bg-base-100 shadow-sm">
					<div class="card-body gap-0 p-5 sm:p-8 md:p-10">
						<section class="border-b border-base-300/50 pb-8 sm:pb-10">
							<h2 class="font-main text-xl leading-snug font-semibold text-secondary sm:text-2xl">
								{_`notice.durability_title`}
							</h2>
							<p class="mt-4 text-sm leading-7 sm:text-base">
								{_`notice.durability_intro`}
							</p>
							<p class="mt-5 text-sm font-semibold text-secondary sm:text-base">
								{_`notice.however`}
							</p>
							<ul class="list mt-3 rounded-box bg-base-200/45 py-1 text-sm sm:text-base">
								{durabilityFactors.map((factor) => (
									<li key={factor} class="list-row gap-3 px-4 py-3">
										<span aria-hidden="true" class="pt-0.5 text-secondary">
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
									{_`notice.guarantee`}
								</p>
							</div>
						</section>

						<section class="border-b border-base-300/50 py-8 sm:py-10">
							<h2 class="font-main text-xl leading-snug font-semibold text-secondary sm:text-2xl">
								{_`notice.hormonal_title`}
							</h2>
							<p class="mt-4 text-sm leading-7 sm:text-base">
								{_`notice.hormonal_intro`}
							</p>
							<p class="mt-5 text-sm font-semibold text-secondary sm:text-base">
								{_`notice.other_factors`}
							</p>
							<ul class="list mt-3 rounded-box bg-base-200/45 py-1 text-sm sm:text-base">
								{individualFactors.map((factor) => (
									<li key={factor} class="list-row gap-3 px-4 py-3">
										<span aria-hidden="true" class="pt-0.5 text-secondary">
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
									{_`notice.understanding`}
								</p>
							</div>
						</section>

						<section class="pt-8 sm:pt-10">
							<h2 class="font-main text-xl leading-snug font-semibold text-secondary sm:text-2xl">
								{_`notice.policy_title`}
							</h2>
							<p class="mt-4 text-sm leading-7 sm:text-base">
								{_`notice.policy_description`}
							</p>
							<p class="mt-4 text-sm font-medium leading-7 text-secondary sm:text-base">
								{_`notice.policy_care`}
							</p>
						</section>
					</div>
				</div>

				<div class="alert border border-base-300 bg-base-100 px-5 py-5 text-center shadow-sm sm:px-8 sm:py-6">
					<p class="w-full font-main text-lg leading-relaxed font-medium text-secondary sm:text-xl">
						{_`notice.thank_you`}
					</p>
				</div>
			</div>
		</section>
	);
});

export const head: DocumentHead = () => {
	return {
		title: _`head.notice.title`,
		meta: [
			{
				name: "description",
				content: _`head.notice.description`,
			},
		],
	};
};
