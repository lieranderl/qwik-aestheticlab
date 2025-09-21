import {
	$,
	component$,
	useOnDocument,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";
import { Booking } from "../booking-modal";

export default component$(() => {
	const isMobile = useSignal(false);
	const t = inlineTranslate();
	useOnDocument(
		"DOMContentLoaded",
		$(() => {
			isMobile.value = window.innerWidth < 1024;
		}),
	);

	useOnWindow(
		"resize",
		$(() => {
			isMobile.value = window.innerWidth < 1024;
		}),
	);

	return (
		<section
			id="home"
			class="relative min-h-screen flex flex-col items-center justify-center bg-primary"
		>
			<div class="custom-container text-center">
				<ImgAestheticlab class="w-64 h-64 md:w-96 md:h-96 mx-auto" />
				<h1 class="text-3xl md:text-5xl font-bold font-montserrat text-center text-base-100">
					{t("app.hero.the_best@@The best")}
					<span class="font-extrabold animate-color-pulse">
						{" "}
						{t("app.hero.manicure@@manicure")}{" "}
					</span>
					{t("app.hero.and@@and")}
					<span class="font-extrabold animate-color-pulse">
						{" "}
						{t("app.hero.pedicure@@pedicure")}{" "}
					</span>
					{t("app.hero.in_leuven@@in Leuven")}
				</h1>
				<p class="text-center font-extralight text-xs italic text-base-300 mb-8">
					{t("app.hero.according@@*according to our clients")}
				</p>

				<p class="text-xl md:text-2xl text-base-100 mb-8 font-light">
					{t("app.hero.slogan@@Where Expertise Crafts Unique Beauty")}
				</p>
			</div>

			{/* Button Container */}
			<div
				class={`w-full text-center transition-all ${
					isMobile.value
						? "fixed bottom-0 left-0 w-full bg-primary py-4 shadow-lg z-10"
						: ""
				}`}
			>
				<Booking
					id="modal_location"
					text={t("app.hero.book_visit@@Book Your Visit")}
					classes="btn btn-xl w-fit mx-auto"
					location="372146"
				/>
			</div>
		</section>
	);
});
