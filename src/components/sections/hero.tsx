import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import ImgAestheticlab from "~/media/AestheticLab.svg?jsx";
import { Booking } from "../booking-modal";

export default component$(() => {
	const t = inlineTranslate();
	return (
		<section
			id="home"
			class="relative min-h-screen flex flex-col items-center justify-center bg-primary"
		>
			<div class="custom-container text-center">
				<ImgAestheticlab class="w-64 h-64 md:w-96 md:h-96 mx-auto" />
				<h1 class="text-3xl md:text-5xl font-bold font-montserrat text-center text-base-100 flex flex-col md:flex-row items-center justify-center gap-2 md:flex-wrap">
					<span>{t("app.hero.the_best@@The best")}</span>
					<span class="text-rotate text-left">
						<span class="justify-items-center text-left">
							<span class="px-2 text-pink-500">
								{t("app.hero.manicure@@manicure")}
							</span>
							<span class="px-2 text-rose-500">
								{t("app.hero.pedicure@@pedicure")}
							</span>
							<span class="px-2 text-fuchsia-600">
								{t("app.hero.brows@@brows")}
							</span>
							<span class="px-2 text-violet-600">
								{t("app.hero.laser@@laser")}
							</span>
						</span>
					</span>
					<span>{t("app.hero.in_leuven@@in Leuven")}</span>
				</h1>
				<p class="text-center font-extralight text-xs italic text-base-300 mb-8">
					{t("app.hero.according@@*according to our clients")}
				</p>

				<p class="text-xl md:text-2xl text-base-100 mb-8 font-light">
					{t("app.hero.slogan@@Where Expertise Crafts Unique Beauty")}
				</p>
			</div>
			<Booking
				id="modal_location"
				text={t("app.hero.book_visit@@Book Your Visit")}
				classes="btn btn-xl w-fit mx-auto hidden xl:block"
				location="372146"
			/>
		</section>
	);
});
