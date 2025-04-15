import {
	$,
	component$,
	useOnDocument,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";
import { BookingBtn } from "../booking-button";
import { inlineTranslate } from "qwik-speak";

export default component$(() => {
	const isMobile = useSignal(false);
	const t = inlineTranslate();
	useOnDocument(
		"DOMContentLoaded",
		$(() => {
			isMobile.value = window.innerWidth < 768;
		}),
	);

	useOnWindow(
		"resize",
		$(() => {
			isMobile.value = window.innerWidth < 768;
		}),
	);

	return (
		<section
			id="home"
			class="relative min-h-screen flex flex-col items-center justify-center bg-primary"
		>
			<div class="custom-container text-center">
				<ImgAestheticlab class="w-64 h-64 md:w-96 md:h-96 mx-auto mb-8" />
				<p class="text-xl md:text-2xl text-base-100 mb-8 font-light">
					{t('app.hero.slogan@@Where Expertise Crafts Unique Beauty')}
				</p>
			</div>

			{/* Button Container */}
			<div
				class={`w-full text-center transition-all ${isMobile.value
						? "fixed bottom-0 left-0 w-full bg-primary py-4 shadow-lg z-10"
						: ""
					}`}
			>
				<BookingBtn
					additionalClasses="btn-xl w-fit mx-auto"
					myText={t('app.hero.book_visit@@Book Your Visit')}
				/>
			</div>
		</section>
	);
});
