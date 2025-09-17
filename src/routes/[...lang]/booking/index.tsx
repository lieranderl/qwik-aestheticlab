import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import "aos/dist/aos.css";
import { ga } from "~/consts";

export default component$(() => {
	return (
		<>
			<div
				class="d-flex justify-content-center "
				style="min-height: calc(100vh - 160px);"
			>
				<iframe
					title="Booking Widget"
					src="https://bookings.gettimely.com/aestheticlab2/bb/book?location=372146"
					id="timelyWidget"
					style="width: 100%; height: calc(100vh - 160px); border: none;"
				/>
			</div>
		</>
	);
});

export const head: DocumentHead = {
	title: "Best Manicure in Leuven | Aesthetic Lab",
	meta: [
		{
			name: "description",
			content: "Booking.",
		},
	],
	scripts: ga,
};
