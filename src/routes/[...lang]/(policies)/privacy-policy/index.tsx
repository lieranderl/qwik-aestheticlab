import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";

export default component$(() => {
	const t = inlineTranslate();
	const sections = [
		{
			title: t("app.privacy.info@@1. Information We Collect"),
			text: t(
				"app.privacy.info_text@@We collect the following personal information when you book an appointment or contact us:",
			),
			list: [
				t("app.privacy.name@@Name"),
				t("app.privacy.email@@Email address"),
				t("app.privacy.phone@@Phone number"),
			],
		},
		{
			title: t("app.privacy.use@@2. How We Use Your Information"),
			text: t("app.privacy.use_text@@We use your information to:"),
			list: [
				t("app.privacy.schedule@@Schedule and confirm appointments"),
				t("app.privacy.send@@Send appointment reminders and updates"),
				t("app.privacy.respond@@Respond to your inquiries"),
				t("app.privacy.improve@@Improve our services"),
			],
		},
		{
			title: t("app.privacy.security@@3. Data Protection & Security"),
			text: t(
				"app.privacy.security_text@@We take reasonable measures to protect your personal data from unauthorized access, loss, or misuse.",
			),
		},
		{
			title: t("app.privacy.sharing@@4. Sharing Your Information"),
			text: t(
				"app.privacy.sharing_text@@We do not sell or rent your personal information. We may share it with:",
			),
			list: [
				t("app.privacy.service@@Service providers (e.g., booking platforms)"),
				t("app.privacy.legal@@Legal authorities if required by law"),
			],
		},
		{
			title: t("app.privacy.rights@@5. Your Rights"),
			text: t(
				"app.privacy.rights_text@@You can request to access, update, or delete your personal data. To make a request, contact us at:",
			),
			link: {
				url: "mailto:aestheticlabbe@gmail.com",
				label: "📧 aestheticlabbe@gmail.com",
			},
		},
		{
			title: t("app.privacy.cookies@@6. Cookies & Tracking Technologies"),
			text: t(
				"app.privacy.cookies_text@@We use strictly necessary cookies to operate the website. Google Analytics runs in Consent Mode v2. Before consent or if you reject analytics, analytics storage and advertising-related consent stay denied; Google may receive cookieless consent and measurement pings, and analytics cookies are not set. If you accept analytics, Google Analytics may use analytics cookies to understand website usage and improve our services. You can change your choice at any time via Cookie settings.",
			),
			list: [
				t(
					"app.privacy.cookies_necessary@@Strictly necessary cookies: always active for basic website functionality.",
				),
				t(
					"app.privacy.cookies_analytics@@Analytics cookies: optional; analytics storage is granted only after your consent.",
				),
			],
		},
		{
			title: t("app.privacy.changes@@7. Changes to This Policy"),
			text: t(
				"app.privacy.changes_text@@We may update this Privacy Policy from time to time. The latest version will always be available on our website.",
			),
		},
	];

	return (
		<section class="grid gap-10 lg:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.38fr)] lg:gap-16 xl:gap-24">
			<header class="lg:sticky lg:top-32 lg:self-start">
				<p class="font-main text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
					Aesthetic Lab Leuven
				</p>
				<h1 class="mt-4 text-balance font-cormorant text-5xl leading-[0.95] text-base-content sm:text-6xl lg:text-7xl">
					{t("app.privacy.privacy_title@@Privacy Policy")}
				</h1>
				<div class="my-6 h-px w-20 bg-primary" />
				<p class="max-w-sm font-main text-sm leading-7 text-base-content">
					{t(
						"app.head.privacy.description@@How Aesthetic Lab collects, uses, and protects your personal information.",
					)}
				</p>
				<p class="badge badge-outline mt-6 min-h-7 border-base-300 px-3 font-main text-xs font-medium uppercase tracking-wider text-base-content">
					{t("app.privacy.last_update_date@@Last updated: 19.02.2026")}
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

export const head: DocumentHead = () => {
	const t = inlineTranslate();
	return {
		title: t("app.head.privacy.title@@Privacy Policy | Aesthetic Lab"),
		meta: [
			{
				name: "description",
				content: t(
					"app.head.privacy.description@@How Aesthetic Lab collects, uses, and protects your personal information.",
				),
			},
		],
	};
};
