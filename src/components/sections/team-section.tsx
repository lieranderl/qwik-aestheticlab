import { component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
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
		<section id="team" class="py-24 bg-base-200 relative overflow-hidden">
			<div class="custom-container mb-12 text-center">
				<FadeUp>
					<h2 class="font-qestero text-4xl md:text-5xl text-base-content mb-4">
						{t("app.team.title@@Meet Our Team")}
					</h2>
					<div class="mx-auto h-px w-20 bg-primary mb-8" />
				</FadeUp>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
					{technicians.map((tech, index) => (
						<FadeUp key={tech.id} delay={index * 150} class="group h-full">
							<TeamMemberCard tech={tech} />
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
});

interface TeamMemberCardProps {
	tech: Staff;
}

function getBioForLang(lang: string, tech: Staff) {
	if (lang.includes("nl")) return tech.about_nl || tech.about;
	if (lang.includes("fr")) return tech.about_fr || tech.about;
	if (lang.includes("ru")) return tech.about_ru || tech.about;
	if (lang.includes("uk")) return tech.about_uk || tech.about;
	return tech.about;
}

export const TeamMemberCard = component$<TeamMemberCardProps>(({ tech }) => {
	const t = inlineTranslate();
	const loc = useLocation();
	const lang = loc.params.lang || "en-BE";
	const isExpanded = useSignal(false);

	return (
		<div class="bg-base-100/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-102 text-center border border-white/50 h-full flex flex-col">
			<div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-base-100 ring-2 ring-primary/20 shrink-0 transition-transform duration-500 group-hover:ring-4 group-hover:ring-primary/40">
				{tech.photo_url === "rubina" && (
					<ImgRubina class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
				)}
				{tech.photo_url === "zara" && (
					<ImgZara class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
				)}
			</div>

			<h3 class="font-qestero text-2xl mb-1">{tech.name}</h3>
			<p class="font-montserrat text-xs tracking-widest uppercase text-primary mb-6 flex items-center justify-center gap-2">
				{tech.role || t("app.team.role.technician@@Technician")}
			</p>

			{/* Bio Description */}
			<div class="mb-8 grow flex flex-col items-center">
				<div
					class={[
						"font-montserrat text-sm  leading-relaxed transition-all duration-300 relative",
						isExpanded.value
							? "max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
							: "line-clamp-4",
					]}
				>
					{getBioForLang(lang, tech)}
				</div>
				<button
					type="button"
					onClick$={() => {
						isExpanded.value = !isExpanded.value;
					}}
					class="mt-2 text-xs font-montserrat tracking-wider text-primary hover:text-primary/80 transition-colors uppercase"
				>
					{isExpanded.value
						? t("app.common.read_less@@Read Less")
						: t("app.common.read_more@@Read More")}
				</button>
			</div>

			<Booking
				id={`modal_tech_${tech.id}`}
				text={t("app.book.book_now@@Book Now")}
				location="372146"
				staff={String(tech.id)}
				classes="btn btn-outline btn-neutral rounded-full px-8 font-montserrat uppercase tracking-wider text-xs hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform active:scale-95 w-full sm:w-auto mx-auto"
			/>
		</div>
	);
});
