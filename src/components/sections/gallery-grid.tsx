import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "~/components/ui/fade-up";
import { InstagramCard } from "~/components/ui/instagram-card";

// Import images with vite-imagetools
import ImgManicure1 from "~/media/gallery/manicure1.jpg?jsx";
import ImgManicure2 from "~/media/gallery/manicure2.jpg?jsx";
import ImgManicure3 from "~/media/gallery/manicure3.jpg?jsx";
import ImgManicure4 from "~/media/gallery/manicure4.jpg?jsx";
import ImgPedicure1 from "~/media/gallery/pedicure1.jpg?jsx";
import ImgPedicure2 from "~/media/gallery/pedicure2.jpg?jsx";
import ImgPedicure3 from "~/media/gallery/pedicure3.jpg?jsx";
import ImgPedicure5 from "~/media/gallery/pedicure5.jpg?jsx";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();

	return (
		<section id="gallery" class="py-24">
			<div class="custom-container">
				<div class="mb-16 text-center">
					<FadeUp>
						<h2 class="font-qestero mb-4 text-4xl md:text-5xl">
							{t("app.work.title@@Our Work")}
						</h2>
						<div class="mx-auto h-px w-20 bg-primary" />
						<p class="font-montserrat mx-auto mt-6 max-w-2xl">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</p>
					</FadeUp>
				</div>

				{/* Static Gallery */}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
					{[
						{ Img: ImgManicure1, id: "m1" },
						{ Img: ImgPedicure5, id: "p5" },
						{ Img: ImgPedicure1, id: "p1" },
						{ Img: ImgManicure4, id: "m4" },
						{ Img: ImgManicure2, id: "m2" },
						{ Img: ImgPedicure2, id: "p2" },
						{ Img: ImgManicure3, id: "m3" },
						{ Img: ImgPedicure3, id: "p3" },
					].map(({ Img, id }, i) => (
						<FadeUp key={id} delay={i * 100} class="overflow-hidden rounded-xl">
							<Img
								alt="Aesthetic Lab Work"
								class="h-full w-full object-cover transition-transform duration-700 hover:scale-110 aspect-square"
							/>
						</FadeUp>
					))}
				</div>

				{/* Instagram Feed Section */}
				<div class="mt-8">
					{" "}
					{/* Reduced margin since static grid is gone */}
					<FadeUp delay={400} class="mb-10 text-center">
						<h3 class="font-qestero mb-2 text-2xl">
							{t("app.contact.instagram@@Follow us on Instagram")}
						</h3>
						<a
							href="https://www.instagram.com/aestheticlabbe"
							target="_blank"
							rel="noreferrer"
							class="font-montserrat text-sm tracking-widest text-secondary hover:underline"
						>
							@aestheticlabbe
						</a>
					</FadeUp>
					<div class="carousel w-full gap-8 overflow-x-auto pb-4 cursor-grab">
						{[
							"DFlEmP1OZ1W",
							"DE-0hEWOwj0",
							"DFFkCjRsSYP",
							"DFIQUnssMp9",
							"DFU_S0EsHsb",
						].map((post_id) => (
							<div key={post_id} class="carousel-item w-[326px] shrink-0">
								<InstagramCard post_id={post_id} />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
});
