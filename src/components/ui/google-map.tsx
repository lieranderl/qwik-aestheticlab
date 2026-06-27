import { component$ } from "@builder.io/qwik";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";

export const MapEmbed = component$(() => {
	const t = inlineTranslate();
	const locale = useSpeakLocale();
	const langCode = locale.lang.split("-")[0] || "en";

	// Dynamically embed the map language parameters using langCode (hl and 1s/2s parameters)
	const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d157.33008906247946!2d4.7103275!3d50.8815015!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c161e3b67fad59%3A0x4c712631503e098f!2sAesthetic%20Lab!5e0!3m2!1s${langCode}!2sbe!4v1758895200503!5m2!1s${langCode}!2sbe`;

	return (
		<div class="w-full h-full">
			<iframe
				title={t("app.contact.map_title@@Aesthetic Lab Location")}
				src={mapUrl}
				width="100%"
				height="100%"
				style="border:0;"
				allowFullscreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				class="w-full h-full block"
			/>
		</div>
	);
});
