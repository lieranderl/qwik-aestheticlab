import { component$ } from "@builder.io/qwik";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";
import ImgRubina from "~/media/rubina.jpg?jsx";
import ImgZara from "~/media/zara.jpg?jsx";
import type { Staff } from "~/types";
import { Booking } from "../booking-modal";
import { FadeUp } from "../fade-up";

export interface TeamSectionProps {
	technicians: Staff[];
}
export const TeamSection = component$(({ technicians }: TeamSectionProps) => {
	const t = inlineTranslate();
	const local = useSpeakLocale();
	const shortlang = local.lang.split("-")[0];
	return (
		<section id="team" class="py-20 bg-base-200">
			<div class="custom-container">
				<h2 class="text-4xl font-qestero text-center mb-12 font-bold">
					{t("app.team.title@@Meet Our Team")}
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4  md:gap-8">
					{technicians.map((tech: Staff) => (
						<FadeUp key={tech.id}>
							<div class="card bg-base-100">
								<div class="card-body">
									<div class="avatar justify-center">
										<div class="w-32 rounded-full">
											{tech.photo_url === "rubina" && <ImgRubina />}
											{tech.photo_url === "zara" && <ImgZara />}
										</div>
									</div>
									<div class="text-center mt-2">
										<Booking
											id={`modal_${tech.id}`}
											text={t("app.book.book_now@@Book Now")}
											location="372146"
											staff={String(tech.id)}
											classes="btn  btn-primary btn-outline"
										/>
									</div>

									{tech.about && (
										<FadeUp>
											<div class="collapse collapse-arrow bg-base-100 ">
												<input type="checkbox" />
												<div class="collapse-title ">
													<p class="text-xl">{tech.name}</p>
													<p class="font-inter badge badge-soft badge-info mb-4">
														{tech.role || "Technician"}
													</p>
												</div>
												{shortlang === "en" && (
													<div class="collapse-content text-sm">
														{tech.about}
													</div>
												)}{" "}
												{shortlang === "ru" && (
													<div class="collapse-content text-sm">
														{tech.about_ru}
													</div>
												)}
												{shortlang === "nl" && (
													<div class="collapse-content text-sm">
														{tech.about_nl}
													</div>
												)}{" "}
												{shortlang === "fr" && (
													<div class="collapse-content text-sm">
														{tech.about_fr}
													</div>
												)}{" "}
												{shortlang === "uk" && (
													<div class="collapse-content text-sm">
														{tech.about_uk}
													</div>
												)}{" "}
											</div>
										</FadeUp>
									)}
								</div>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
});
