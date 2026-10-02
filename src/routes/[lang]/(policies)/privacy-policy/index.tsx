import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { _ } from "compiled-i18n";
import { localizeHead } from "~/shared/i18n";

export default component$(() => {
	const sections = [
		{
			title: _`privacy.info`,
			text: _`privacy.info_text`,
			list: [_`privacy.name`, _`privacy.email`, _`privacy.phone`],
		},
		{
			title: _`privacy.use`,
			text: _`privacy.use_text`,
			list: [
				_`privacy.schedule`,
				_`privacy.send`,
				_`privacy.respond`,
				_`privacy.improve`,
			],
		},
		{
			title: _`privacy.security`,
			text: _`privacy.security_text`,
		},
		{
			title: _`privacy.sharing`,
			text: _`privacy.sharing_text`,
			list: [_`privacy.service`, _`privacy.legal`],
		},
		{
			title: _`privacy.rights`,
			text: _`privacy.rights_text`,
			link: {
				url: "mailto:aestheticlabbe@gmail.com",
				label: "📧 aestheticlabbe@gmail.com",
			},
		},
		{
			title: _`privacy.cookies`,
			text: _`privacy.cookies_text`,
			list: [_`privacy.cookies_necessary`, _`privacy.cookies_analytics`],
		},
		{
			title: _`privacy.changes`,
			text: _`privacy.changes_text`,
		},
	];

	return (
		<section class="grid gap-10 lg:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.38fr)] lg:gap-16 xl:gap-24">
			<header class="lg:sticky lg:top-32 lg:self-start">
				<p class="font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
					Aesthetic Lab Leuven
				</p>
				<h1 class="mt-4 text-balance font-cormorant text-5xl leading-[0.95] text-base-content sm:text-6xl lg:text-7xl">
					{_`privacy.privacy_title`}
				</h1>
				<div class="my-6 h-px w-20 bg-primary" />
				<p class="max-w-sm font-main text-sm leading-7 text-base-content">
					{_`head.privacy.description`}
				</p>
				<p class="badge badge-outline mt-6 min-h-7 border-base-300 px-3 font-main text-xs font-medium uppercase tracking-wider text-base-content">
					{_`privacy.last_update_date`}
				</p>
			</header>

			<div class="card card-border overflow-hidden border-base-300 bg-base-100 shadow-sm">
				<div class="card-body gap-0 p-5 sm:p-8 md:p-10">
					{sections.map((section, idx) => (
						<article
							key={section.title}
							class={
								idx < sections.length - 1
									? "border-b border-base-300/50 py-7 first:pt-0 sm:py-9"
									: "pt-7 sm:pt-9"
							}
						>
							<h2 class="font-main text-xl leading-snug font-semibold text-secondary sm:text-2xl">
								{section.title}
							</h2>
							<p class="mt-4 font-main text-sm leading-7 text-base-content sm:text-base">
								{section.text}
							</p>
							{section.list && (
								<ul class="list mt-5 rounded-box bg-base-200/45 py-1 font-main text-sm text-base-content sm:text-base">
									{section.list.map((item) => (
										<li key={item} class="list-row gap-3 px-4 py-3">
											<span aria-hidden="true" class="pt-0.5 text-secondary">
												✦
											</span>
											<span class="leading-6">{item}</span>
										</li>
									))}
								</ul>
							)}
							{section.link && (
								<div class="card-actions mt-5">
									<a
										class="btn btn-outline btn-primary min-h-11 max-w-full rounded-full px-4 text-sm normal-case"
										href={section.link.url}
									>
										<span class="truncate">{section.link.label}</span>
									</a>
								</div>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	);
});

export const head: DocumentHead = localizeHead(() => {
	return {
		title: _`head.privacy.title`,
		meta: [
			{
				name: "description",
				content: _`head.privacy.description`,
			},
		],
	};
});
