import { component$ } from "@builder.io/qwik";

export const BookingBtn = component$(
	({
		additionalClasses,
		myText,
	}: {
		additionalClasses?: string;
		myText?: string;
	}) => {
		const t = myText ? myText : "Book Now";
		return (
			<button
				type="button"
				class={`btn ${additionalClasses}`}
				onClick$={() => {
					window.location.href = "/booking/";
				}}
			>
				{t}
			</button>
		);
	},
);
