import { component$ } from "@builder.io/qwik";
import { HiEnvelopeOutline, HiMapPinOutline } from "@qwikest/icons/heroicons";
import { SiInstagram } from "@qwikest/icons/simpleicons";

export default component$(() => {
	return (
		<section id="contact" class="py-20 bg-base-300">
			<div class="container mx-auto px-4 md:px-16 ">
				<div class="max-w-4xl mx-auto">
					<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
						Visit Us
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<h3 class="text-2xl mb-6 font-semibold">Hours</h3>
							<ul class="space-y-2 list-disc pl-6">
								<li>Monday - Sunday: 10:00 - 21:00</li>
							</ul>
						</div>
						<div>
							<h3 class="text-2xl mb-6 font-semibold ">Contact</h3>
							<ul class="space-y-2 list-none pl-6">
								<li class="flex items-center gap-2">
									<HiEnvelopeOutline />
									<a
										href="mailto:aestheticlabbe@gmail.com"
										class="link link-hover"
									>
										aestheticlabbe@gmail.com
									</a>
								</li>
								<li class="flex items-center gap-2">
									<HiMapPinOutline />
									<a
										href="https://maps.app.goo.gl/2mEvv7cnPVNuTm6e8"
										target="_blank"
										class="link link-hover"
										rel="noreferrer"
									>
										Vital Decosterstraat 29, 3000 Leuven. Gala De Luxe.
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Centered Instagram Section */}
					<div class="my-12 flex justify-center">
						<a
							rel="noopener noreferrer"
							target="_blank"
							href="https://www.instagram.com/aestheticlabbe/"
							class="link inline-flex items-center gap-2 text-lg font-inter hover:text-base-content/70 transition-colors"
						>
							<SiInstagram class="w-6 h-6" />
							Follow us on Instagram
						</a>
					</div>
				</div>
			</div>
		</section>
	);
});
