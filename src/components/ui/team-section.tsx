import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";
import { Booking } from "~/components/ui/booking-modal";
import { FadeUp } from "~/components/ui/fade-up";
import ImgRubina from "~/media/rubina.jpg?jsx";
import ImgZara from "~/media/zara.jpg?jsx";
import type { Staff } from "~/types";

interface TeamSectionProps {
	technicians: Staff[];
}

export const TeamSection = component$<TeamSectionProps>(({ technicians }) => {
	const t = inlineTranslate();

	return (
		<section id="team" class="py-24 bg-base-100">
			<div class="custom-container">
				<FadeUp class="text-center mb-16">
					<h2 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
						{t("app.team.title@@Meet Our Team")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary" />
				</FadeUp>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
					{technicians.map((tech, index) => (
						<FadeUp key={tech.id} delay={index * 150} class="group">
							<div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
								<div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-base-100">
									{tech.photo_url === "rubina" && (
										<ImgRubina class="w-full h-full object-cover" />
									)}
									{tech.photo_url === "zara" && (
										<ImgZara class="w-full h-full object-cover" />
									)}
								</div>

								<h3 class="font-qestero text-2xl mb-1">{tech.name}</h3>
								<p class="font-montserrat text-xs tracking-widest uppercase text-primary mb-4 flex items-center justify-center gap-2">
									{tech.role || t("app.team.role.technician@@Technician")}
								</p>

								<Booking
									id={`modal_tech_${tech.id}`}
									text={t("app.book.book_now@@Book Now")}
									location="372146"
									staff={String(tech.id)}
									classes="btn btn-outline btn-neutral rounded-full px-8 font-montserrat uppercase tracking-wider text-xs"
								/>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
});
