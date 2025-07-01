import { component$ } from "@builder.io/qwik";
import { HiHomeOutline } from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { ChangeLocale } from "~/components/change-locale";

export default component$(() => {
	const t = inlineTranslate();

	return (
		<>
			<h1 class="text-3xl font-bold text-primary mb-6">
				{t("app.privacy.privacy_title@@Privacy Policy")}
			</h1>
			<p class="mb-4">
				{t("app.privacy.last_update@@Last updated:")} 11.04.2025
			</p>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.info@@1. Information We Collect")}
			</h2>
			<p class="mb-4">
				{t(
					"app.privacy.info_text@@We collect the following personal information when you book an appointment or contact us:",
				)}
			</p>
			<ul class="list-disc pl-6 mb-4">
				<li>{t("app.privacy.name@@Name")}</li>
				<li>{t("app.privacy.email@@Email address")}</li>
				<li>{t("app.privacy.phone@@Phone number")}</li>
			</ul>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.use@@2. How We Use Your Information")}
			</h2>
			<p class="mb-4">
				{t("app.privacy.use_text@@we use your information to:")}
			</p>
			<ul class="list-disc pl-6 mb-4">
				<li>{t("app.privacy.schedule@@Schedule and confirm appointments")}</li>

				<li>{t("app.privacy.send@@Send appointment reminders and updates")}</li>
				<li>{t("app.privacy.respond@@Respond to your inquiries")}</li>
				<li>{t("app.privacy.improve@@Improve our services")}</li>
			</ul>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.security@@3. Data Protection & Security")}
			</h2>
			<p class="mb-4">
				{t(
					"app.privacy.security_text@@We take reasonable measures to protect your personal data from unauthorized access, loss, or misuse.",
				)}
			</p>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.sharing@@4. Sharing Your Information")}
			</h2>
			<p class="mb-4">
				{t(
					"app.privacy.sharing_text@@We do not sell or rent your personal information. We may share it with:",
				)}
			</p>
			<ul class="list-disc pl-6 mb-4">
				<li>
					{t(
						"app.privacy.service@@Service providers (e.g., booking platforms)",
					)}
				</li>
				<li>{t("app.privacy.legal@@Legal authorities if required by law")}</li>
			</ul>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.rights@@5. Your Rights")}
			</h2>
			<p>
				{t(
					"app.privacy.rights_text@@You can request to access, update, or delete your personal data. To make a request, contact us at:",
				)}
			</p>
			<p class="mb-4">
				<a
					class="link link-secondary font-bold mb-4"
					href="mailto:aestheticlabbe@gmail.com"
				>
					📧 aestheticlabbe@gmail.com
				</a>
			</p>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.cookies@@6. Cookies & Tracking Technologies")}
			</h2>
			<p class="mb-4">
				{t(
					"app.privacy.cookies_text@@We may use cookies or analytics tools to enhance user experience. You can disable cookies in your browser settings.",
				)}
			</p>

			<h2 class="text-xl font-semibold text-secondary mb-2">
				{t("app.privacy.changes@@7. Changes to This Policy")}
			</h2>
			<p class="mb-4">
				{t(
					"app.privacy.changes_text@@We may update this Privacy Policy from time to time. The latest version will always be available on our website.",
				)}
			</p>
		</>
	);
});
