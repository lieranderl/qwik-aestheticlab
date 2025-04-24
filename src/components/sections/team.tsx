import { component$ } from "@builder.io/qwik";
import { inlineTranslate, useSpeakLocale } from "qwik-speak";
import ImgRubina from "~/media/rubina.jpg?jsx";
import ImgZara from "~/media/zara.jpg?jsx";
import type { Technician } from "~/types";

export interface TeamSectionProps {
	technicians: Technician[];
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
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 ">
					{technicians.map((tech: Technician) => (
						<div key={tech.id} class="card bg-base-100" data-aos="fade-up">
							<div class="card-body">
								<div class="avatar justify-center">
									<div class="w-32 rounded-full">
										{tech.photo_url === "rubina" && <ImgRubina />}
										{tech.photo_url === "zara" && <ImgZara />}
									</div>
								</div>
								{tech.about && (
									<div
										class="collapse collapse-arrow bg-base-100 "
										data-aos="fade-up"
									>
										<input type="checkbox" />
										<div class="collapse-title ">
											<p class="text-xl">{tech.name}</p>
											<p class="font-inter badge badge-soft badge-info mb-4">
												{tech.role || "Technician"}
											</p>
										</div>
										{shortlang === "en" && (
											<div class="collapse-content text-sm">{tech.about}</div>
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
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
});
