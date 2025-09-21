import { component$ } from "@builder.io/qwik";

export const MapEmbed = component$(() => {
	return (
		<div class="w-full h-64 md:h-96 rounded-xl overflow-hidden">
			<iframe
				title="Aesthetic Lab Location"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.67416025544!2d4.700904676237066!3d50.8827277593132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c160da8c37f0ff%3A0x3f8f71f46c6efc0!2sDiestsestraat%20174%2C%203000%20Leuven!5e0!3m2!1sen!2sbe!4v1695319812345!5m2!1sen!2sbe"
				width="100%"
				height="100%"
				style="border:0;"
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	);
});
