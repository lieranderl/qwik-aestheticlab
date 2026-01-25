import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { InstagramCard } from "~/components/ui/instagram-card";
import { FadeUp } from "./fade-up";

export const GalleryGrid = component$(() => {
	const t = inlineTranslate();

	return (
		<section id="gallery" class="bg-white py-24">
			<div class="custom-container">
				<div class="mb-16 text-center">
					<FadeUp>
						<h2 class="font-qestero mb-4 text-4xl text-base-content md:text-5xl">
							{t("app.work.title@@Our Work")}
						</h2>
						<div class="mx-auto h-px w-20 bg-primary" />
						<p class="font-montserrat mx-auto mt-6 max-w-2xl text-neutral-content">
							{t("app.hero.slogan@@The Art of Natural Beauty")}
						</p>
					</FadeUp>
				</div>

				{/* Static Gallery Removed to focus on Instagram Feed as 'Our Work' */}

				{/* Instagram Feed Section */}
				<div class="mt-8">
					{" "}
					{/* Reduced margin since static grid is gone */}
					<FadeUp delay={400} class="mb-10 text-center">
						<h3 class="font-qestero mb-2 text-2xl text-base-content">
							{t("app.contact.instagram@@Follow us on Instagram")}
						</h3>
						<a
							href="https://www.instagram.com/aestheticlabbe"
							target="_blank"
							rel="noreferrer"
							class="font-montserrat text-sm tracking-widest text-primary hover:underline"
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
