import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="min-h-screen bg-base-100 text-base-content p-2 md:p-6">
			<div class="max-w-3xl mx-auto bg-base-200 p-8 rounded-box shadow-lg">
				<h1 class="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
				<p class="mb-4">Last Updated: 11.02.2025</p>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					1. Information We Collect
				</h2>
				<p class="mb-4">
					We collect the following personal information when you book an
					appointment or contact us:
				</p>
				<ul class="list-disc pl-6 mb-4">
					<li>Name</li>
					<li>Email address</li>
					<li>Phone number</li>
				</ul>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					2. How We Use Your Information
				</h2>
				<p class="mb-4">We use your information to:</p>
				<ul class="list-disc pl-6 mb-4">
					<li>Schedule and confirm appointments</li>
					<li>Send appointment reminders and updates</li>
					<li>Respond to your inquiries</li>
					<li>Improve our services</li>
				</ul>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					3. Data Protection & Security
				</h2>
				<p class="mb-4">
					We take reasonable measures to protect your personal data from
					unauthorized access, loss, or misuse.
				</p>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					4. Sharing Your Information
				</h2>
				<p class="mb-4">
					We do not sell or rent your personal information. We may share it
					with:
				</p>
				<ul class="list-disc pl-6 mb-4">
					<li>Service providers (e.g., database platforms)</li>
					<li>Legal authorities if required by law</li>
				</ul>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					5. Your Rights
				</h2>
				<p>
					You can request to access, update, or delete your personal data. To
					make a request, contact us at:
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
					6. Cookies & Tracking Technologies
				</h2>
				<p class="mb-4">
					We may use cookies or analytics tools to enhance user experience. You
					can disable cookies in your browser settings.
				</p>

				<h2 class="text-xl font-semibold text-secondary mb-2">
					7. Changes to This Policy
				</h2>
				<p class="mb-4">
					We may update this Privacy Policy from time to time. The latest
					version will always be available on our website.
				</p>
			</div>
		</div>
	);
});
