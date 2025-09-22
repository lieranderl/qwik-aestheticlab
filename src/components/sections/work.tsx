import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { FadeUp } from "../fade-up";
import { InstagramCard } from "./instagram-card";

const INSTAGRAM_LINKS = [
	"DFlEmP1OZ1W",
	"DE-0hEWOwj0",
	"DFFkCjRsSYP",
	"DFIQUnssMp9",
	"DFU_S0EsHsb",
];

export default component$(() => {
	const t = inlineTranslate();
	return (
		<section id="work" class="py-20 bg-base-200">
			<div class="custom-container">
				<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
					{t("app.work.title@@Our Work")}
				</h2>
				<FadeUp>
					<div class="carousel w-full gap-8">
						{INSTAGRAM_LINKS.map((post_id) => {
							return (
								<div class="carousel-item" key={post_id}>
									<InstagramCard post_id={post_id} />
								</div>
							);
						})}
					</div>
				</FadeUp>
			</div>
		</section>
	);
});
