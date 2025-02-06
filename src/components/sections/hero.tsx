import { component$ } from "@builder.io/qwik";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";
import { BookingBtn } from "../booking-button";

export default component$(() => {
	return (
		<section
			id="home"
			class="relative min-h-screen flex items-center justify-center bg-primary "
		>
			<div class="custom-container text-center">
				<ImgAestheticlab class="w-64 h-64 md:w-96 md:h-96 mx-auto mb-8" />
				<p class="text-xl md:text-2xl text-base-100 mb-8 font-light">
				Where Expertise Crafts Unique Beauty
				</p>
				<BookingBtn additionalClasses="btn-xl btn-wide" myText={"Book Your Visit"} />
			</div>
		</section>
	);
});
