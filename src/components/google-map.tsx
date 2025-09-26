import { component$ } from "@builder.io/qwik";

export const MapEmbed = component$(() => {
  return (
    <div class="w-full h-64 md:h-96 rounded-xl overflow-hidden">
      <iframe
	  	title="Aesthetic Lab Location"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d157.33008906247946!2d4.7103275!3d50.8815015!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c161e3b67fad59%3A0x4c712631503e098f!2sAesthetic%20Lab!5e0!3m2!1sen!2sbe!4v1758895200503!5m2!1sen!2sbe"
        width="100%"
        height="100%"
        style="border:0;"
        allowFullscreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
});
