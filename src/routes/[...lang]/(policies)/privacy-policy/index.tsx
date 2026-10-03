import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { KickerLabel } from "~/components/ui/kicker-label";
import { SITE_METADATA } from "~/constants/metadata";
import { openCookieSettings } from "~/shared/cookie-consent";

interface PolicySection {
	title: string;
	text: string;
	list?: string[];
}

export default component$(() => {
	const t = inlineTranslate();
	const sections: PolicySection[] = [
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

	const contactSection: PolicySection = {
		title: t("app.privacy.who@@Who we are"),
		text: t(
			"app.privacy.who_text@@Aesthetic Lab, {{address}}. For anything about your data, write to {{email}}.",
			{
				address: `${SITE_METADATA.address.street}, ${SITE_METADATA.address.zip} ${SITE_METADATA.address.city}`,
				email: SITE_METADATA.email,
			},
		),
	};
	// Translations carry their own "1." prefixes; the layout numbers sections itself.
	const allSections = [contactSection, ...sections].map((section, index) => ({
		...section,
		title: section.title.replace(/^\d+\.\s*/, ""),
		id: `privacy-${index + 1}`,
		number: String(index + 1).padStart(2, "0"),
	}));

	return (
		<div class="mx-auto grid max-w-360 gap-10 px-5.5 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,42.5rem)] lg:gap-x-20 lg:px-16 lg:py-24 xl:gap-x-34 xl:px-28">
			<aside class="flex flex-col gap-4 lg:sticky lg:top-28 lg:gap-7 lg:self-start">
				<KickerLabel class="mb-0">{t("app.privacy.kicker@@Legal")}</KickerLabel>
				<h1 class="font-cormorant text-[2.875rem] leading-[0.95] lg:text-[5rem] lg:leading-[0.9]">
					{t("app.privacy.privacy_title@@Privacy Policy")}
				</h1>
				<p class="font-main text-xs font-semibold tracking-[0.18em] text-base-content/80 uppercase">
					{t("app.privacy.last_update_date@@Last updated: 19.02.2026")}
				</p>
				<nav
					aria-label={t("app.privacy.on_this_page@@On this page")}
					class="hidden border-t border-neutral font-main text-sm lg:block"
				>
					<ul>
						{allSections.map((section) => (
							<li key={section.id}>
								<a
									href={`#${section.id}`}
									class="flex gap-4 border-b border-base-300 py-3 hover:underline"
								>
									<span class="text-primary-content/80">{section.number}</span>
									{section.title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			<article class="flex flex-col gap-9 font-main text-base leading-[1.7] lg:gap-11 lg:text-[1.0625rem]">
				<p class="font-cormorant text-[1.375rem] leading-[1.35] italic lg:text-[1.625rem]">
					{t(
						"app.head.privacy.description@@How Aesthetic Lab collects, uses, and protects your personal information.",
					)}
				</p>
				{allSections.map((section, index) => {
					const isRights = index === allSections.length - 3;
					const isCookies = index === allSections.length - 2;
					return (
						<section
							key={section.id}
							id={section.id}
							aria-labelledby={`${section.id}-title`}
							class={[
								"flex scroll-mt-28 flex-col gap-3",
								isRights
									? "bg-primary px-5 py-6 text-primary-content lg:px-8 lg:py-7"
									: "",
							]}
						>
							<h2
								id={`${section.id}-title`}
								class="flex items-baseline gap-4.5 font-cormorant text-[1.75rem] leading-[1.1] lg:text-[2.125rem]"
							>
								<span
									class={["text-lg", isRights ? "" : "text-primary-content/80"]}
								>
									{section.number}
								</span>
								{section.title}
							</h2>
							<p>{section.text}</p>
							{section.list ? (
								<ul class="border-t border-base-300">
									{section.list.map((item) => (
										<li key={item} class="border-b border-base-300 py-2.5">
											{item}
										</li>
									))}
								</ul>
							) : null}
							{isRights ? (
								<a
									href={`mailto:${SITE_METADATA.email}`}
									class="btn btn-neutral mt-1 h-12 min-h-12 self-start px-5.5 font-main text-xs font-semibold tracking-[0.18em] uppercase"
								>
									{t("app.privacy.email_request@@Email a data request")}
								</a>
							) : null}
							{isCookies ? (
								<button
									type="button"
									onClick$={() => openCookieSettings()}
									class="btn btn-outline mt-1 h-12 min-h-12 self-start border-neutral px-5.5 font-main text-xs font-semibold tracking-[0.18em] uppercase"
								>
									{t("app.privacy.change_cookies@@Change cookie settings")}
								</button>
							) : null}
						</section>
					);
				})}
			</article>
		</div>
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
