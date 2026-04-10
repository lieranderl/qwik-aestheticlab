import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";

export default component$(() => {
	const t = inlineTranslate();

	return (
		<section class="min-h-screen w-full overflow-hidden bg-base-200 py-24 z-0">
			<div class="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
				<FadeUp>
					<div class="text-center mb-16">
						<h1 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
							{t("app.privacy.privacy_title@@Privacy Policy")}
						</h1>
						<div class="h-px w-20 bg-primary mx-auto mb-6" />
						<p class="font-montserrat text-sm text-neutral-content uppercase tracking-widest">
							{t("app.privacy.last_update@@Last updated:")} 19.02.2026
						</p>
					</div>

					<div class="prose max-w-none mx-auto bg-transparent font-montserrat text-base-content/80">
						{[
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
									t(
										"app.privacy.service@@Service providers (e.g., booking platforms)",
									),
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
								title: t(
									"app.privacy.cookies@@6. Cookies & Tracking Technologies",
								),
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
						].map((section, idx) => (
							<div key={idx} class="mb-8">
								<FadeUp delay={100 + idx * 50}>
									<div class="card bg-base-100 shadow-sm border border-base-200">
										<div class="card-body">
											<h2 class="card-title font-qestero text-2xl text-secondary mb-2">
												{section.title}
											</h2>
											<p class="mb-4 leading-relaxed">{section.text}</p>
											{section.list && (
												<ul class="space-y-3 mb-6 bg-base-200/30 p-4 rounded-xl">
													{section.list.map((item, i) => (
														<li key={i} class="flex items-start gap-3">
															<span class="text-primary mt-1">✦</span>
															<span>{item}</span>
														</li>
													))}
												</ul>
											)}
											{section.link && (
												<div class="card-actions">
													<a
														class="btn btn-outline btn-primary btn-sm rounded-full"
														href={section.link.url}
													>
														{section.link.label}
													</a>
												</div>
											)}
										</div>
									</div>
								</FadeUp>
							</div>
						))}
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
